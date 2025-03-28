const ApiError = require('../error/ApiError');
const {Users, Roles} = require("../models/models");
const {hash} = require("bcrypt");
const TokenService = require("./tokenService");
const bcrypt = require("bcrypt");
const ms = require("ms");

const saveRefreshTokenToCookie = (res, tokens) => {
    res.cookie("refreshToken", tokens.refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: ms(process.env.JWT_REFRESH_EXPIRES),
    });
}

class UserController {
    async login(req, res, next) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return next(ApiError.badRequest("Не указан email или пароль"));
            }

            const user = await Users.findOne({
                where: {email},
                include: [{model: Roles, attributes: ['name']}]
            });
            if (!user) {
                return next(ApiError.badRequest("Пользователь не найден"));
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return next(ApiError.forbidden("Неверный пароль"));
            }

            const tokens = TokenService.generateTokens({id: user.id, email: user.email});
            user.refreshToken = tokens.refreshToken;
            await user.save();

            await saveRefreshTokenToCookie(res, tokens);

            return res.json({
                message: "Успешно авторизирован",
                accessToken: tokens.accessToken,
                user: {
                    username: user.username,
                    firstName: user.first_name,
                    lastName: user.last_name,
                    email: user.email,
                    role_name: user.role.name,
                }
            });
        } catch (e) {
            return next(ApiError.internal(e.message));
        }
    }
    async register(req, res, next) {
        try {
            const {username, email, password} = req.body;

            if (!email || !password || !username) {
                return next(ApiError.badRequest('Не указан email, пароль или username'))
            }

            const existingUser = await Users.findOne({where: {email}});

            if (existingUser) {
                return next(ApiError.badRequest("Пользователь уже существует"));
            }

            const hashedPassword = await hash(password, 10);
            const newUser = await Users.create({email, username, password: hashedPassword})

            const tokens = TokenService.generateTokens({id: newUser.id, email: newUser.email});

            newUser.refresh_token = tokens.refreshToken;
            await newUser.save();

            saveRefreshTokenToCookie(res, tokens);

            return res.json({
                message: "Пользователь зарегистрирован",
                accessToken: tokens.accessToken,
                user: {
                    username: newUser.username,
                    email: newUser.email,
                }}
            );
        } catch (e) {
            return next(ApiError.internal(e.message));
        }
    }
    async check(req, res, next) {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader) {
                return next(ApiError.forbidden("Токен не предоставлен"));
            }

            const token = authHeader.split(" ")[1];
            if (!token) {
                return next(ApiError.forbidden("Некорректный формат токена"));
            }

            const userData = TokenService.validateAccessToken(token);
            if (!userData) {
                return next(ApiError.forbidden("Токен недействителен"));
            }

            return res.json({ message: "Токен валиден", user: userData });
        } catch (e) {
            return next(ApiError.internal("Ошибка авторизации"));
        }
    }

    async refresh(req, res, next) {
        try {
            const { refreshToken } = req.cookies;

            if (!refreshToken) {
                return next(ApiError.forbidden("RefreshToken не предоставлен"));
            }

            const userData = TokenService.validateRefreshToken(refreshToken);
            if (!userData) {
                res.clearCookie("refreshToken");
                return next(ApiError.unauthorized("Требуется повторная авторизация"));
            }

            const user = await Users.findOne({ where: refreshToken });
            if (!user) {
                res.clearCookie("refreshToken");
                return next(ApiError.unauthorized("Пользователь не найден, авторизуйтесь заново"));
            }

            const tokens = TokenService.generateTokens({ id: user.id, email: user.email });

            user.refreshToken = tokens.refreshToken;
            await user.save();

            saveRefreshTokenToCookie(res, tokens);

            return res.json({
                message: "Токены обновлены",
                accessToken: tokens.accessToken
            });
        } catch (e) {
            res.clearCookie("refreshToken");
            return next(ApiError.internal("Ошибка при обновлении токена"));
        }
    }

    async logout(req, res, next) {
        try {
            const { refreshToken } = req.body;
            if (!refreshToken) {
                return next(ApiError.forbidden("Токен не предоставлен"));
            }

            const user = await Users.findOne({ where: refreshToken});
            if (!user) {
                return next(ApiError.badRequest("Пользователь не найден"));
            }

            user.refreshToken = null;
            await user.save();

            res.clearCookie("refreshToken");

            return res.json({ message: "Выход выполнен" });
        } catch (e) {
            return next(ApiError.internal(e.message));
        }
    }
}

module.exports = new UserController();