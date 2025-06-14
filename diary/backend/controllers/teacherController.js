const {Teachers, Users, Groups, Subjects, Schedule, Students} = require("../models/models");
const ApiError = require("../error/ApiError");
const {Op} = require("sequelize");
const dayjs = require("dayjs");

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

    async getSubjectsByTeacher(req, res, next) {
        try {
            const { weekOffset = 0, email } = req.query;

            if (!email) {
                return next(ApiError.badRequest('Не указан email преподавателя'));
            }

            const user = await Users.findOne({ where: { email } });
            if (!user) {
                return next(ApiError.badRequest('Пользователь с таким email не найден'));
            }

            const teacher = await Teachers.findOne({ where: { user_id: user.id } });
            if (!teacher) {
                return next(ApiError.badRequest('Преподаватель с таким user_id не найден'));
            }

            const startOfWeek = dayjs().add(weekOffset, 'week').startOf('isoWeek');
            const endOfWeek = startOfWeek.add(4, 'day');

            const schedule = await Schedule.findAll({
                where: {
                    teacherId: teacher.id,
                    date: {
                        [Op.between]: [startOfWeek.toDate(), endOfWeek.toDate()],
                    }
                },
                include: [
                    {
                        model: Subjects,
                        attributes: ['name'],
                    },
                    {
                        model: Groups,
                        attributes: ['name'],
                    }
                ],
                order: [['date', 'ASC'], ['lesson_number', 'ASC']],
            });

            return res.json(schedule);
        } catch (e) {
            console.log(e)
            next(e)
        }
    }

    async getTeacherDashboard (req, res, next) {
        try {
            const { email } = req.query;

            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const dayAfterTomorrow = new Date();
            dayAfterTomorrow.setDate(today.getDate() + 2);
            dayAfterTomorrow.setHours(23, 59, 59, 999);

            const result = {};

            const user = await Users.findOne({where: { email }})
            if (!user) {
                return next(ApiError.badRequest(("Пользователь не найден")))
            }

            if (user.role_id === 2) {
                const teacher = await Teachers.findOne({
                    where: { user_id: user.id }
                });

                if (!teacher) {
                    return next(ApiError.badRequest("Преподаватель не найден"))
                }

                result.upcomingClasses = await Schedule.findAll({
                    where: {
                        teacherId: teacher.id,
                        date: {
                            [Op.between]: [
                                today,
                                dayAfterTomorrow
                            ]
                        }
                    },
                    include: [
                        { model: Subjects, attributes: ['name'] },
                        { model: Groups, attributes: ['name'] }
                    ],
                    order: [['date', 'ASC'], ['lesson_number', 'ASC']],
                    limit: 10
                });
            }

            return res.json(result)
        } catch (e) {
            console.log(e)
            next(e)
        }
    }

    async getAdminDashboard (req, res, next) {
        try {
            const { email } = req.query;

            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const dayAfterTomorrow = new Date();
            dayAfterTomorrow.setDate(today.getDate() + 2);
            dayAfterTomorrow.setHours(23, 59, 59, 999);

            const result = {};

            const user = await Users.findOne({where: { email }})
            if (!user) {
                return next(ApiError.badRequest(("Пользователь не найден")))
            }

            if (user.role_id === 1) {
                result.recentStudents = await Students.findAll({
                    include: [
                        {
                            model: Users,
                            attributes: ['email', 'first_name', 'last_name'],
                            where: { role_id: 3 }
                        },
                        { model: Groups, attributes: ['name'] }
                    ],
                    order: [['created_at', 'DESC']],
                    limit: 5
                });

                result.recentTeachers = await Teachers.findAll({
                    include: [
                        {
                            model: Users,
                            attributes: ['email', 'first_name', 'last_name'],
                            where: { role_id: 2 }
                        }
                    ],
                    order: [['created_at', 'DESC']],
                    limit: 5
                });
            }

            return res.json(result);
        } catch (e) {
            console.log(e)
            next(e)
        }
    }
}

module.exports = new TeacherService();