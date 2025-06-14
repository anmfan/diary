const {Users, Subjects, Students, Groups, Teachers, Roles, Schedule, Marks} = require("../models/models");
const ApiError = require("../error/ApiError");
const sequelize = require('../db');
const {Op} = require("sequelize");

class StudentsService {
    async getAllStudents(req, res, next) {
        try {
            const students = await Users.findAll({
                where: { role_id: 3 },
                attributes: ['id','username', 'email', 'first_name', 'last_name', 'avatar'],
                include: [
                    {
                        model: Students,
                        attributes: ['id', 'group_id'],
                        include: [
                            {
                                model: Groups,
                                attributes: ['name']
                            }
                        ]
                    }
                ]
            });

            const formatted = students.map(user => ({
                id: user.id,
                username: user.username,
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
                avatar: user.avatar,
                group: user.student?.group?.name || null
            }));

            return res.json(formatted);
        } catch (e) {
            console.error(e);
            return next(e);
        }
    }

    async deleteStudent(req, res, next) {
        const transaction = await sequelize.transaction();
        try {
            const { id } = req.body;

            if (!id) {
                await transaction.rollback();
                return next(ApiError.badRequest("Не указан ID студента."))
            }

            const student = await Students.findOne({
                where: { user_id: id },
                transaction
            });

            if (!student) {
                await transaction.rollback();
                return next(ApiError.badRequest("Студент не найден."));
            }

            const groupId = student.group_id;

            await student.destroy({ transaction });

            await Users.destroy({
                where: { id },
                transaction
            });

            let groupData = null;
            if (groupId !== null) {
                const group = await Groups.findByPk(groupId, {
                    attributes: ['students_count', 'name'],
                    transaction
                });

                if (group) {
                    groupData = {
                        groupId,
                        groupName: group.name,
                        groupStudentCount: group.students_count
                    };
                }
            }

            await transaction.commit();
            const response = {
                message: "Студент успешно удалён"
            };

            if (groupData) {
                response.userId = id;
                response.groupName = groupData.groupName;
                response.groupStudentCount = groupData.groupStudentCount;
            }

            return res.json(response);
        } catch (e) {
            await transaction.rollback();
            return next(e);
        }
    }

    async addGroup(req, res, next) {
        try {
            const { userId, groupId } = req.body;

            if (!userId || !groupId) {
                return next(ApiError.badRequest("userId и groupId обязательны"))
            }

            const student = await Students.findOne({ where: { user_id: userId } });
            const teacher = await Teachers.findOne({ where: { user_id: userId } });
            const user = await Users.findByPk(userId);

            if (!user) {
                return next(ApiError.badRequest("Пользователь не найден"));
            }

            if (!student && !teacher) {
                return next(ApiError.badRequest("Пользователь не является ни студентом, ни преподавателем"));
            }

            const group = await Groups.findByPk(groupId);
            if (!group) {
                return next(ApiError.badRequest("Группа не найдена"))
            }

            if (student) {
                if (student.group_id === groupId) {
                    return next(ApiError.badRequest("Студент уже прикреплён к этой группе"))
                }

                const alreadyInGroup = !!student.group_id;

                student.group_id = groupId;
                await student.save();

                if (!alreadyInGroup) {
                    group.students_count += 1;
                    await group.save();
                }

                return res.json({
                    message: 'Студент прикреплён к группе',
                    group: {
                        name: group.name,
                        course: group.course,
                    },
                    students_count: group.students_count,
                    user: {
                        id: user.id,
                        first_name: user.first_name,
                        last_name: user.last_name,
                        email: user.email
                    },
                    type: 'student'
                });
            }

            if (teacher) {
                if (group.curator_id === teacher.id) {
                    return next(ApiError.badRequest("Преподаватель уже является куратором этой группы"))
                }

                group.curator_id = teacher.id;
                await group.save();

                return res.json({
                    message: 'Преподаватель назначен куратором группы',
                    group: {
                        name: group.name,
                        course: group.course,
                    },
                    students_count: group.students_count,
                    user: {
                        id: user.id,
                        first_name: user.first_name,
                        last_name: user.last_name,
                        email: user.email
                    },
                    type: 'teacher'
                });
            }
        } catch (e) {
            return next(e);
        }
    }

    async removeGroup(req, res, next) {
        try {
            const { user_id, group_name } = req.query;

            const userId = user_id;

            if (!userId) {
                return res.status(400).json({ message: 'userId обязателен' });
            }

            const student = await Students.findOne({ where: { user_id: userId } });

            if (student) {
                if (!student.group_id) {
                    return next(ApiError.badRequest("Студент не прикреплён к группе"))
                }

                const oldGroup = await Groups.findByPk(student.group_id);

                student.group_id = null;
                await student.save();

                if (oldGroup && oldGroup.students_count > 0) {
                    oldGroup.students_count -= 1;
                    await oldGroup.save();
                }

                return res.json({
                    type: 'student',
                    message: 'Студент успешно откреплён от группы',
                    deletedId: Number(user_id),
                    oldGroup: oldGroup?.name,
                    students_count: oldGroup?.students_count,
                });
            }

            const teacher = await Teachers.findOne({ where: { user_id: userId } });

            if (teacher) {
                if (!group_name) {
                    return next(ApiError.badRequest("Для преподавателя требуется указать поле group_name"));
                }

                const group = await Groups.findOne({
                    where: {
                        curator_id: teacher.id,
                        name: group_name
                    }
                });

                if (!group) {
                    return next(ApiError.badRequest("Группа с таким названием не найдена у преподавателя"))
                }

                group.curator_id = null;
                await group.save();

                return res.json({
                    type: 'teacher',
                    message: 'Группа успешно откреплена от преподавателя',
                    deletedId: Number(user_id),
                    oldGroup: group.name,
                });
            }

            return next(ApiError.badRequest("Пользователь не найден как студент или преподаватель"))
        } catch (e) {
            return next(e)
        }
    }

    async getGroup(req, res, next) {
        try {
            const { email } = req.query;

            if (!email) {
                return res.status(400).json({ message: "Email обязателен" });
            }

            const user = await Users.findOne({
                where: { email },
                include: [{
                    model: Roles,
                    as: 'role',
                    attributes: ['name']
                }]
            });

            if (!user) {
                return res.status(404).json({ message: "Пользователь не найден" });
            }

            if (user.role && user.role.name.toLowerCase() === 'студент') {
                const student = await Students.findOne({
                    where: { user_id: user.id },
                    include: [{
                        model: Groups,
                        as: 'group',
                        attributes: ['id']
                    }]
                });

                if (student && student.group) {
                    return res.json({ group: student.group.id });
                } else {
                    return res.json({ group: null });
                }
            }

            return res.json({ group: null });
        } catch (e) {
            console.log(e)
            next(e)
        }
    }

    async getStudentDashboard (req, res, next) {
        try {
            const { email } = req.query;

            // Создаем даты в правильном формате
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const todayStr = today.toISOString().split('T')[0]; // Формат YYYY-MM-DD

            const dayAfterTomorrow = new Date();
            dayAfterTomorrow.setDate(today.getDate() + 2);
            dayAfterTomorrow.setHours(23, 59, 59, 999);
            const dayAfterTomorrowStr = dayAfterTomorrow.toISOString().split('T')[0];

            const result = {};

            const user = await Users.findOne({ where: { email } });
            if (!user) {
                return next(ApiError.badRequest("Пользователь не найден"));
            }

            if (user.role_id === 3) {
                const student = await Students.findOne({
                    where: { user_id: user.id },
                    include: [Groups]
                });

                if (!student) {
                    return next(ApiError.badRequest("Студент не найден"));
                }

                if (!student.group_id) {
                    result.upcomingClasses = [];
                } else {
                    result.upcomingClasses = await Schedule.findAll({
                        where: {
                            groupId: student.group_id,
                            date: {
                                [Op.between]: [todayStr, dayAfterTomorrowStr]
                            }
                        },
                        include: [
                            { model: Subjects, attributes: ['name'] }
                        ],
                        order: [
                            ['date', 'ASC'],
                            ['lesson_number', 'ASC']
                        ],
                        limit: 10
                    });
                }

                result.recentMarks = await Marks.findAll({
                    where: { studentId: student.id },
                    include: [
                        { model: Subjects, attributes: ['name'] }
                    ],
                    order: [['created_at', 'DESC']],
                    limit: 5
                });
            }

            return res.json(result);
        } catch (e) {
            next(e)
        }
    }
}

module.exports = new StudentsService();