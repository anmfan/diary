const {Teachers, Users} = require("../models/models");
const ApiError = require("../error/ApiError");

class TeacherService {
    async getAllTeachers(req, res, next) {
        try {
            const teachers = await Users.findAll({
                where: { role_id: 2 },
                attributes: ['id','username', 'email', 'first_name', 'last_name', 'avatar']
            });

            return res.json(teachers);
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