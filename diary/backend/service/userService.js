const Users = require("../models/models").Users;
const {hash, compare} = require("bcrypt");
const tokenService = require("../service/tokenService");
const UserDto = require("../dto/userDto");
const ApiError = require("../error/ApiError");
const {Roles, Teachers, Students, Groups} = require("../models/models");

class UserService {
    async registration(
        email,
        password,
        username,
        role_id = 3,
        group_id,
        fullName = null,
        transaction
    ) {
        const hashPassword = await hash(password, 10);

        let first_name = null;
        let last_name = null;

        if (fullName) {
            const nameParts = fullName.trim().split(" ");
            first_name = nameParts[0];
            last_name = nameParts.slice(1).join(" ");
        }

        group_id = group_id || null;

        const user = await Users.create({
            email,
            username,
            password: hashPassword,
            role_id,
            first_name,
            last_name,
        }, { transaction });

        const userWithRole = await Users.findByPk(user.id, {
            include: [{
                model: Roles,
                as: 'role',
                attributes: ['name']
            }],
            transaction
        });

        const userDto = new UserDto(userWithRole);
        const tokens = tokenService.generateTokens({ ...userDto });
        await tokenService.saveToken(user.id, tokens.refreshToken, transaction);

        if (role_id === 3) {
            const student = await Students.findOne({
                where: { user_id: user.id },
                include: [{
                    model: Groups,
                    as: 'group',
                    attributes: ['name']
                }],
                transaction
            });

            if (student && group_id) {
                await student.update({ group_id }, { transaction });

                const group = await Groups.findByPk(group_id, {
                    attributes: ['name', 'students_count'],
                    transaction
                });

                if (group) {
                    userDto.group = group.name;
                    userDto.groupStudentCount = Number(group.students_count);
                }
            }
        } else if (role_id === 2 && group_id) {
            const teacher = await Teachers.findOne({
                where: { user_id: user.id },
                transaction
            });

            if (teacher) {
                const groupIsExist = await Groups.findOne({
                    where: { id: group_id },
                    transaction
                });

                if (!groupIsExist) {
                    throw ApiError.badRequest("Группа не найдена");
                }

                if (groupIsExist.curator_id) {
                    throw ApiError.badRequest("Данная группа уже имеет куратора");
                }

                await Groups.update(
                    { curator_id: teacher.id },
                    { where: { id: group_id }, transaction }
                );

                const group = await Groups.findByPk(group_id, { transaction });
                userDto.group = group
                    ? { name: group.name, course: group.course }
                    : null;
            }
        }

        return { ...tokens, user: userDto };
    }

    async login(email, password) {
        const user = await Users.findOne({
            where: { email },
            include: [{
                model: Roles,
                as: 'role',
                attributes: ['name']
            }]
        });
        if (!user) {
            throw(ApiError.badRequest(`Пользователь с таким email не был найден`));
        }

        const isPasswordValid = await compare(password, user.password);
        if (!isPasswordValid) {
            throw(ApiError.badRequest("Неверный пароль"))
        }

        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto});
        await tokenService.saveToken(user.id, tokens.refreshToken)

        return {...tokens, user: userDto}
    }

    async logout(refreshToken) {
        return await tokenService.removeToken(refreshToken);
    }

    async refresh (refreshToken) {
        if (!refreshToken) {
            res.clearCookie('refreshToken');
            throw ApiError.unauthorized();
        }
        const userData = tokenService.validateRefreshToken(refreshToken);
        const tokenFROMDB = await tokenService.findToken(refreshToken);
        if (!userData || !tokenFROMDB) {
            await tokenService.removeToken(refreshToken);
            throw ApiError.unauthorized();
        }

        const user = await Users.findByPk(userData.id, {
            include: [{ model: Roles, as: 'role', attributes: ['name'] }]
        });
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto});
        await tokenService.saveToken(user.id, tokens.refreshToken)

        return {...tokens, user: userDto}
    }
}

module.exports = new UserService;