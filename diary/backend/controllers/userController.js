const ApiError = require('../error/ApiError');
const {Users, Roles, Groups} = require("../models/models");
const UserService = require("../service/userService");
const {validationResult } = require("express-validator");
const sequelize = require('../db');
const {generateRandomPassword, generateUsername} = require("../helper");
const BulkRegistration = require("../service/bulkRegistration");

const ACCESS_TOKEN = "AccessToken";

class UserController {
    async login(req, res, next) {
        try {
            const { email, password } = req.body;

            const userData = await UserService.login(email, password);

            res.cookie('refreshToken', userData.refreshToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: true,
            })

            return res.json({
                    message: "Пользователь авторизирован",
                    userData: {...userData}
                }
            );
        } catch (e) {
            return next(e);
        }
    }
    async register(req, res, next) {
        const transaction = await sequelize.transaction();
        try {
            if (req.file) {
                const results = await BulkRegistration.handleBulkRegistration(req.file, transaction);
                await transaction.commit();
                return res.json({
                    message: 'Массовая регистрация завершена',
                    results
                });
            }

            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                await transaction.rollback();
                return next(ApiError.badRequest('Ошибка при валидации', errors.array()))
            }

            const {
                email,
                role_id,
                group_id,
                group_name,
                fullName,
            } = req.body;

            const candidate = await Users.findOne({where: {email}, transaction})
            if (candidate) {
                await transaction.rollback();
                return next(ApiError.badRequest(`Пользователь с адресом ${email} уже существует`));
            }

            let actualGroupId = group_id;

            if (!group_id && group_name && Number(role_id) === 3) {
                let group = await Groups.findOne({ where: { name: group_name }, transaction });

                actualGroupId = group.id;
            }

            const password = generateRandomPassword();
            const username = generateUsername();

            const userData = await UserService.registration(
                email,
                password,
                username,
                Number(role_id),
                actualGroupId,
                fullName,
                transaction
            );

            await transaction.commit();

            return res.json({
                message: "Пользователь зарегистрирован",
                userData: {...userData}
            }
            );
        } catch (e) {
            console.log(e)
            return next(e);
        }
    }

    async refresh(req, res, next) {
        try {
            const { refreshToken } = req.cookies;
            const userData = await UserService.refresh(refreshToken)
            res.cookie('refreshToken', userData.refreshToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: true,
            })
            return res.json({message: "Токен обновлен", userData: userData});
        } catch (e) {
            return next(e);
        }
    }

    async logout(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            await UserService.logout(refreshToken)
            res.clearCookie('refreshToken')
            return res.json({ message: "Выход выполнен" });
        } catch (e) {
            return next(e);
        }
    }

    async getAccount(req, res, next) {
        return res.json({message: "Какие-то данные"})
    }

    async edit(req, res, next) {
        try {
            const { id, email, fullName } = req.body;

            if (!email && !fullName) {
                return next(ApiError.badRequest("Нужно указать хотя бы одно поле для обновления"));
            }

            const user = await Users.findByPk(id);
            if (!user) {
                return next(ApiError.badRequest("Пользователь не найден"));
            }

            let isSameEmail = true;
            let isSameFullName = true;

            if (email && email !== user.email) {
                const existingUser = await Users.findOne({ where: { email } });
                if (existingUser && existingUser.id !== user.id) {
                    return next(ApiError.badRequest(`Email ${email} уже используется`));
                }
                isSameEmail = false;
            }

            let first_name, last_name;
            if (fullName) {
                const parts = fullName.trim().split(" ");
                first_name = parts[0];
                last_name = parts.slice(1).join(" ");
                const currentFullName = `${user.first_name} ${user.last_name}`.trim();
                isSameFullName = fullName.trim() === currentFullName;
            }

            if (isSameEmail && isSameFullName) {
                return next(ApiError.badRequest("Новые данные совпадают с текущими"));
            }

            if (!isSameEmail) {
                user.email = email;
            }

            if (!isSameFullName) {
                user.first_name = first_name;
                user.last_name = last_name;
            }

            await user.save();

            const responseUser = {
                id: user.id,
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
            };

            if (user.role_id === 2) {
                responseUser.teacher = "teacher";
            }

            return res.json({
                message: "Данные пользователя обновлены",
                user: responseUser
            });
        } catch (e) {
            return next(e);
        }
    }
}

module.exports = new UserController();