const {Groups, Teachers, Users, Students} = require("../models/models");
const ApiError = require("../error/ApiError");

class GroupsService {
    async getAllGroups(req, res, next) {
        try {
            const groups = await Groups.findAll({
                attributes: ['id','name', 'students_count', 'course'],
                include: [
                    {
                    model: Teachers,
                    as: 'curator',
                    attributes: ['user_id'],
                    include: [{
                        model: Users,
                        attributes: ['first_name', 'last_name', 'email']
                    }]
                },
                    {
                        model: Students,
                        attributes: ['user_id'],
                        include: [{
                            model: Users,
                            attributes: ['first_name', 'last_name', 'email']
                        }]
                    }
                ]
            });

            return res.json(groups);
        } catch (e) {
            console.log(e)
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

            let curator = null;
            let curatorIdToSave = null;

            if (curator_id) {
                curator = await Teachers.findOne({
                    where: { user_id: curator_id },
                    include: [{
                        model: Users,
                        attributes: ['email', 'first_name', 'last_name']
                    }]
                });

                if (!curator) {
                    return next(ApiError.badRequest('Преподаватель не найден'));
                }

                curatorIdToSave = curator.id;
            }

            const newGroup = await Groups.create({
                name,
                course,
                curator_id: curatorIdToSave,
            });

            const responseData = {
                id: newGroup.id,
                name: newGroup.name,
                course: newGroup.course,
                students_count: newGroup.students_count,
                students: [],
            };

            if (curator) {
                responseData.curator = {
                    user_id: curator.user_id,
                    user: {
                        email: curator.user.email,
                        first_name: curator.user.first_name,
                        last_name: curator.user.last_name
                    }
                };
            }

            if (!curator) {
                responseData.curator = null;
            }

            return res.status(201).json(responseData);
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
            const file = req.file;

            const group = await Groups.findByPk(groupId);

            if (!group) {
                return res.status(404).json({ message: 'Группа не найдена' });
            }

            const oldGroupName = group.name;

            group.name = newGroupName;
            await group.save();

            const { created_at, updated_at, ...updated } = group.toJSON();
            return res.json({
                message: 'Название группы обновлено успешно',
                updated,
                oldGroupName,
            });
        } catch (e) {
            return next(e);
        }
    }

    async getOne(req, res, next) {
        try {
            const { email } = req.query;

            if (!email) {
                return next(ApiError.badRequest("Email не передан"))
            }

            const user = await Users.findOne({ where: { email } });
            if (!user) {
                return next(ApiError.badRequest("Пользователь не найден"))
            }

            const teacher = await Teachers.findOne({where: {user_id: user.id}})
            if (!teacher) {
                return next(ApiError.badRequest("Преподаватель не найден"))
            }

            const group = await Groups.findOne({
                where: { curator_id: teacher.id },
                attributes: ['id', 'name', 'students_count', 'course'],
                include: [
                    {
                        model: Teachers,
                        as: 'curator',
                        attributes: ['user_id'],
                        include: [{
                            model: Users,
                            attributes: ['first_name', 'last_name', 'email']
                        }]
                    },
                    {
                        model: Students,
                        attributes: ['user_id'],
                        include: [{
                            model: Users,
                            attributes: ['first_name', 'last_name', 'email']
                        }]
                    }
                ]
            });

            if (!group) {
                return next(ApiError.badRequest("Группа не найдена"))
            }

            return res.json(group);
        } catch (err) {
            next(err)
        }
    }
}

module.exports = new GroupsService();