const {Teachers, Users, Groups} = require("../models/models");
const ApiError = require("../error/ApiError");

class TeacherService {
    async getAllTeachers(req, res, next) {
        try {
            const teachers = await Teachers.findAll({
                include: [
                    {
                        model: Users,
                        attributes: ['id', 'username', 'email', 'first_name', 'last_name', 'avatar']
                    },
                    {
                        model: Groups,
                        as: 'curated_groups',
                        attributes: ['name', 'course']
                    }
                ]
            });

            const response = teachers.map(teacher => {
                const user = teacher.user;

                return {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    avatar: user.avatar,
                    curated_groups: teacher.curated_groups || []
                };
            });

            return res.json(response);
        } catch (e) {
            return next(e);
        }
    }

    async deleteTeacher(req, res, next) {
        try {
            const { id } = req.body;

            if (!id) {
                return next(ApiError.badRequest("Не указан ID преподавателя."))
            }

            const teacher = await Users.findOne({ where : { id } });

            if (!teacher) {
                return next(ApiError.badRequest("Пользователь не найден."))
            }

            await teacher.destroy();

            return res.json({message: "Преподаватель успешно удалён"})
        } catch (e) {
            return next(e);
        }
    }
}

module.exports = new TeacherService();