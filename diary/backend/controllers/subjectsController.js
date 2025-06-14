const { Subjects, Users, Groups, GroupSubjects, Teachers, SubjectTeachers, GroupSubjectAssignments, Students} = require("../models/models");
const { badRequest } = require("../error/ApiError");

class SubjectsService {
    async getAllSubjects(req, res, next) {
        try {
            const subjects = await Subjects.findAll({
                attributes: ['id','name', 'classroom'],
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
            return next(e);
        }
    }

    async create(req, res, next) {
        try {
            const { name, classroom } = req.body;

            if(!name) {
                return next(badRequest("Требуется название предмета"))
            }

            if(!classroom) {
                return next(badRequest("Требуется номер аудитории"))
            }

            const existingSubject = await Subjects.findOne({ where: { name } });

            if (existingSubject) {
                return next(badRequest("Такой предмет уже существует"));
            }

            const newSubject = await Subjects.create({ name, classroom })

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
                    return next(badRequest("Пользователь не найден"))
                }

                const teacher = await Teachers.findOne({where: {user_id: user.id}});
                if (!teacher) {
                    return next(badRequest("Преподаватель не найден"))
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
                    id: teacher.id,
                    user: {
                        id: user.id,
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

                const subjectTeacher = await SubjectTeachers.findOne({
                    where: {
                        teacherId: subjectTeacherId,
                        subjectId: subject.id,
                    }
                });
                if (!subjectTeacher) {
                    return next(badRequest("Связь преподавателя с предметом не найдена"));
                }

                if (subjectTeacher.subjectId !== subject.id) {
                    return next(badRequest("Указанный преподаватель не относится к этому предмету"));
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
            console.log(e)
            return next(e);
        }
    }

    async getSubjectsByGroup(req, res, next) {
        try {
            const { groupIds } = req.query;

            if (!groupIds) {
                return next(badRequest("groupIds обязателен"));
            }

            const groupIdArray = groupIds.split(',').map(id => parseInt(id.trim())).filter(Boolean);

            const assignments = await GroupSubjectAssignments.findAll({
                where: {
                    groupId: groupIdArray
                },
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
                    groupId: assignment.groupId,
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
            next(e)
        }
    }

    async getTaughtGroupsByTeacher(req, res, next) {
        try {
            const { teacherEmail } = req.query;

            if (!teacherEmail) {
                return next(badRequest("teacherEmail обязателен"));
            }

            const user = await Users.findOne({
                where: { email: teacherEmail }
            });

            if (!user) {
                return next(badRequest("Пользователь с таким email не найден"));
            }

            const teacher = await Teachers.findOne({
                where: { user_id: user.id }
            });

            if (!teacher) {
                return next(badRequest("Преподаватель с таким email не найден"));
            }

            console.log('teacher', teacher)
            const assignments = await GroupSubjectAssignments.findAll({
                where: { teacherId: teacher.id },
                include: [
                    {
                        model: Groups,
                        attributes: ['id', 'name']
                    },
                    {
                        model: Subjects,
                        attributes: ['id', 'name']
                    }
                ]
            });

            const grouped = {};

            for (const assignment of assignments) {
                const group = assignment.group;
                const subject = assignment.subject;

                if (!grouped[group.id]) {
                    grouped[group.id] = {
                        groupId: group.id,
                        groupName: group.name,
                        subjects: [],
                        students: []
                    };
                }

                grouped[group.id].subjects.push({
                    subjectId: subject.id,
                    subjectName: subject.name
                });
            }

            const groupIds = Object.keys(grouped).map(id => parseInt(id));

            const studentsInGroups = await Students.findAll({
                where: {
                    group_id: groupIds
                },
                include: [
                    {
                        model: Users,
                        attributes: ['id', 'first_name', 'last_name', 'email']
                    }
                ]
            });


            for (const student of studentsInGroups) {
                const groupEntry = grouped[student.group_id];
                if (groupEntry) {
                    groupEntry.students.push({
                        id: student.user.id,
                        first_name: student.user.first_name,
                        last_name: student.user.last_name,
                        email: student.user.email
                    });
                }
            }

            return res.json(Object.values(grouped));
        } catch (e) {
            console.log(e);
            next(e);
        }
    }
}

module.exports = new SubjectsService();