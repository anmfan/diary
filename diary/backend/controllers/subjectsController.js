const { Subjects, Users, Groups, GroupSubjects, Teachers, SubjectTeachers, GroupSubjectAssignments} = require("../models/models");
const { badRequest } = require("../error/ApiError");

class SubjectsService {
    async getAllSubjects(req, res, next) {
        try {
            const subjects = await Subjects.findAll({
                attributes: ['id','name'],
                include: [
                    {
                        model: Teachers,
                        attributes: ['id'],
                        through: { attributes: [] },
                        include: [{
                            model: Users,
                            attributes: ['id', 'first_name', 'last_name', 'email']
                        }]
                    },
                    {
                        model: Groups,
                        attributes: ['id', 'name', 'course'],
                        through: { attributes: [] },
                        as: 'assigned_groups'
                    }
                ]
            });

            return res.json(subjects);
        } catch (e) {
            console.log(e)
            return next(e);
        }
    }

    async create(req, res, next) {
        try {
            const { name } = req.body;

            if(!name) {
                return next(badRequest("Требуется название предмета"))
            }

            const existingSubject = await Subjects.findOne({ where: { name } });

            if (existingSubject) {
                return next(badRequest("Такой предмет уже существует"));
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
            const id = Number(req.query.id);

            if (!id) {
                return next(badRequest("Не указан ID предмета."))
            }

            const subject = await Subjects.findOne({ where : { id } });

            if (!subject) {
                return next(badRequest("Предмет не найден."))
            }

            await subject.destroy();

            return res.json({message: "Предмет успешно удалён"})
        } catch (e) {
            return next(e);
        }
    }

    async edit(req, res, next) {
        try {
            const { subjectId, newSubjectName, teacher_id, group_id, subjectTeacherId } = req.body;

            const subject = await Subjects.findByPk(Number(subjectId));
            if (!subject) {
                return res.status(404).json({ message: 'Предмет не найден' });
            }

            if (newSubjectName) {
                subject.name = newSubjectName;
                await subject.save();
            }

            let teacherAdded = null;
            let groupAttached = null;

            if (teacher_id) {
                const user = await Users.findByPk(teacher_id);
                if (!user) {
                    return next(ApiError.badRequest("Пользователь не найден"))
                }

                const teacher = await Teachers.findOne({where: {user_id: user.id}});
                if (!teacher) {
                    return next(ApiError.badRequest("Преподаватель не найден"))
                }

                const existingTeacherLink = await SubjectTeachers.findOne({
                    where: {
                        subjectId: subject.id,
                        teacherId: teacher.id
                    }
                });

                if (!existingTeacherLink) {
                    await SubjectTeachers.create({
                        subjectId: subject.id,
                        teacherId: teacher.id
                    });
                }

                teacherAdded = {
                    id: user.id,
                    user: {
                        first_name: user.first_name,
                        last_name: user.last_name,
                        email: user.email
                    }
                };
            }

            if (group_id) {
                if (!subjectTeacherId) {
                    return next(badRequest("Нельзя добавить группу без выбора преподавателя для предмета"));
                }

                const subjectTeacher = await SubjectTeachers.findOne({where: { teacherId: subjectTeacherId }});
                if (!subjectTeacher || subjectTeacher.subjectId !== subject.id) {
                    return next(badRequest("Такой преподаватель не ведёт данный предмет"));
                }

                const group = await Groups.findByPk(group_id);
                if (!group) return next(badRequest("Группа не найдена"))

                const existingAssignment = await GroupSubjectAssignments.findOne({
                    where: {
                        groupId: group.id,
                        subjectId: subject.id
                    }
                });

                if (!existingAssignment) {
                    await GroupSubjectAssignments.create({
                        groupId: group.id,
                        subjectId: subject.id,
                        teacherId: subjectTeacher.teacherId
                    });
                }

                groupAttached = {
                    id: group.id,
                    name: group.name,
                    course: group.course,
                    teacher: subjectTeacher.teacherId
                };
            }

            const { created_at, updated_at, ...updated } = subject.toJSON();
            return res.json({
                message: 'Предмет обновлён',
                updated: {
                    ...updated,
                    teacherAdded,
                    groupAttached
                },
            });
        } catch (e) {
            return next(e);
        }
    }

    async getSubjectsByGroup(req, res, next) {
        try {
            const { groupId } = req.query;

            if (!groupId) {
                return next(badRequest("groupId обязателен"));
            }

            const assignments = await GroupSubjectAssignments.findAll({
                where: { groupId },
                include: [
                    {
                        model: Subjects,
                        attributes: ['id', 'name']
                    },
                    {
                        model: Teachers,
                        include: [
                            {
                                model: Users,
                                attributes: ['id', 'first_name', 'last_name', 'email']
                            }
                        ]
                    }
                ]
            });

            const result = assignments.map(assignment => {
                const subject = assignment.subject;
                const teacher = assignment.teacher;
                const user = teacher?.user;

                return {
                    subject: subject ? {
                        id: subject.id,
                        name: subject.name
                    } : null,
                    teacher: user ? {
                        id: user.id,
                        user: {
                            first_name: user.first_name,
                            last_name: user.last_name,
                            email: user.email
                        }
                    } : null
                };
            });

            return res.json(result);
        } catch (e) {
            console.log(e)
            next(e)
        }
    }
}

module.exports = new SubjectsService();