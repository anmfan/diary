const {Groups, Teachers, Users} = require("../models/models");
const ApiError = require("../error/ApiError");

class GroupsService {
    async getAllGroups(req, res, next) {
        try {
            const groups = await Groups.findAll({
                attributes: ['id','name', 'students_count', 'course'],
                include: [{
                    model: Teachers,
                    attributes: ['user_id'],
                    include: [{
                        model: Users,
                        attributes: ['first_name', 'last_name', 'email']
                    }]
                }]
            });

            return res.json(groups);
        } catch (e) {
            return next(e);
        }
    }

    async create(req, res, next) {
        try {
            const { name, curator_id, course } = req.body;

            if (!name) {
                return next(ApiError.badRequest('Требуется название группы'));
            }

            const existingGroup = await Groups.findOne({ where: { name } });
            if (existingGroup) {
                return next(ApiError.badRequest('Такая группа уже существует'));
            }

            const teacher = await Teachers.findOne({
                where: { user_id: curator_id },
                include: [{
                    model: Users,
                    attributes: ['email', 'first_name', 'last_name']
                }]
            });
            if (!teacher) {
                return next(ApiError.badRequest('Преподаватель не найден'));
            }

            const newGroup = await Groups.create({
                name,
                course,
                curator_id: teacher.id,
            });

            return res.status(201).json({
                id: newGroup.id,
                name: newGroup.name,
                course: newGroup.course,
                students_count: newGroup.students_count,
                teacher: {
                    user_id: teacher.user_id,
                    user: {
                        email: teacher.user.email,
                        first_name: teacher.user.first_name,
                        last_name: teacher.user.last_name
                    }
                }
            });
        } catch (e) {
            return next(e);
        }
    }

    async deleteGroup(req, res, next) {
        try {
            const { id } = req.body;

            if (!id) {
                return next(ApiError.badRequest("Не указан ID группы."))
            }

            const group = await Groups.findOne({ where : { id } });

            if (!group) {
                return next(ApiError.badRequest("Группа не найдена."))
            }

            await group.destroy();

            return res.json({message: "Группа успешно удалена."})
        } catch (e) {
            return next(e);
        }
    }

    async edit(req, res, next) {
        try {
            const { groupId, newGroupName } = req.body;

            const group = await Groups.findByPk(groupId);

            if (!group) {
                return res.status(404).json({ message: 'Группа не найдена' });
            }

            group.name = newGroupName;
            await group.save();

            const { created_at, updated_at, ...updated } = group.toJSON();
            return res.json({ message: 'Название группы обновлено успешно', updated });
        } catch (e) {
            return next(e);
        }
    }
}

module.exports = new GroupsService();