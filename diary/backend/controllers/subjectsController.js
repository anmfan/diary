const {Subjects, Users, Groups} = require("../models/models");
const ApiError = require("../error/ApiError");

class SubjectsService {
    async getAllSubjects(req, res, next) {
        try {
            const groups = await Subjects.findAll({
                attributes: ['id','name']
            });

            return res.json(groups);
        } catch (e) {
            return next(e);
        }
    }

    async create(req, res, next) {
        try {
            const { name } = req.body;

            if(!name) {
                return next(ApiError.badRequest("Требуется название предмета"))
            }

            const existingSubject = await Subjects.findOne({ where: { name } });

            if (existingSubject) {
                return next(ApiError.badRequest("Такой предмет уже существует"));
            }

            const newSubject = await Subjects.create({ name })

            const { created_at, updated_at, ...responseData } = newSubject.toJSON();

            return res.status(201).json(responseData);
        } catch (e) {
            return next(e.message);
        }
    }

    async deleteSubject(req, res, next) {
        try {
            const { id } = req.body;

            if (!id) {
                return next(ApiError.badRequest("Не указан ID предмета."))
            }

            const subject = await Subjects.findOne({ where : { id } });

            if (!subject) {
                return next(ApiError.badRequest("Предмет не найден."))
            }

            await subject.destroy();

            return res.json({message: "Предмет успешно удалён"})
        } catch (e) {
            return next(e);
        }
    }

    async edit(req, res, next) {
        try {
            const { subjectId, newSubjectName } = req.body;

            const subject = await Subjects.findByPk(subjectId);

            if (!subject) {
                return res.status(404).json({ message: 'Предмет не найден' });
            }

            subject.name = newSubjectName;
            await subject.save();

            const { created_at, updated_at, ...updated } = subject.toJSON();
            return res.json({ message: 'Название группы обновлено успешно', updated });
        } catch (e) {
            return next(e);
        }
    }
}

module.exports = new SubjectsService();