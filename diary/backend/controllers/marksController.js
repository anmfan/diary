const { badRequest } = require("../error/ApiError");
const {Students, GroupSubjectAssignments, Marks, Users, Teachers, Subjects, Groups} = require("../models/models");
const ApiError = require("../error/ApiError");

class MarksController {
    async add(req, res, next) {
        try {
            const { studentId, subjectId, date, mark } = req.body;

            if (mark < 1 || mark > 5) {
                return next(badRequest("Оценка должна быть от 1 до 5"))
            }

            const student = await Students.findOne({where: { user_id: studentId }});
            if (!student) return next(badRequest("Студент не найден"));

            const isAssigned = await GroupSubjectAssignments.findOne({
                where: {
                    groupId: student.group_id,
                    subjectId,
                }
            });

            if (!isAssigned) {
                return next(badRequest("Преподаватель не назначен на предмет для этой группы"));
            }

            const existingMarks = await Marks.count({
                where: {
                    studentId: student.id,
                    subjectId,
                    date: new Date(date)
                }
            });

            if (existingMarks >= 2) {
                return next(badRequest("Максимум 2 оценки на одну дату по одному предмету"))
            }

            const newMark = await Marks.create({
                studentId: student.id,
                subjectId,
                date: new Date(date),
                mark
            });

            const payload = {
                id: newMark.id,
                studentId: studentId,
                subjectId: newMark.subjectId,
                date: newMark.date,
                mark: newMark.mark
            };

            res.status(201).json(payload);
        } catch (e) {
            next(e)
        }
    }

    async delete(req, res) {

    }

    async getMarksByTeacher(req, res, next) {
        try {
            const { email, groupName } = req.query;

            if (!email) {
                return next(ApiError.badRequest("Email обязателен"));
            }
            if (!groupName) {
                return next(ApiError.badRequest("Название группы обязательно"));
            }

            const user = await Users.findOne({ where: { email } });
            if (!user) {
                return next(ApiError.badRequest('Пользователь с таким email не найден'));
            }

            const teacher = await Teachers.findOne({ where: { user_id: user.id } });
            if (!teacher) {
                return next(ApiError.badRequest('Преподаватель не найден'));
            }

            const assignments = await GroupSubjectAssignments.findAll({
                where: { teacherId: teacher.id },
                attributes: ['groupId', 'subjectId'],
                include: [{
                    model: Groups,
                    attributes: ['id', 'name'],
                    where: { name: groupName }
                }]
            });

            if (assignments.length === 0) {
                return res.json({
                    groupName: groupName,
                    students: []
                });
            }

            const groupIds = [...new Set(assignments.map(a => a.groupId))];
            const subjectIds = [...new Set(assignments.map(a => a.subjectId))];
            const groupId = groupIds[0];

            const students = await Students.findAll({
                where: { group_id: groupId },
                include: [{
                    model: Users,
                    attributes: ['id', 'first_name', 'last_name']
                }]
            });

            if (students.length === 0) {
                return res.json({
                    groupName: groupName,
                    students: []
                });
            }

            const studentIds = students.map(s => s.id);

            const marks = await Marks.findAll({
                where: {
                    studentId: studentIds,
                    subjectId: subjectIds
                },
                include: [{
                    model: Subjects,
                    attributes: ['id', 'name']
                }],
                order: [['id', 'DESC']]
            });

            const marksByStudent = {};

            const dateCounter = new Map();

            marks.forEach(mark => {
                const key = `${mark.studentId}-${mark.subjectId}-${mark.date}`;

                if (!dateCounter.has(key)) {
                    dateCounter.set(key, 0);
                }

                if (dateCounter.get(key) < 3) {
                    dateCounter.set(key, dateCounter.get(key) + 1);

                    if (!marksByStudent[mark.studentId]) {
                        marksByStudent[mark.studentId] = [];
                    }
                    marksByStudent[mark.studentId].push(mark);
                }
            });

            const studentsWithMarks = students.map(student => {
                const studentMarks = marksByStudent[student.id] || [];

                const subjectMap = new Map();
                studentMarks.forEach(mark => {
                    if (!subjectMap.has(mark.subjectId)) {
                        subjectMap.set(mark.subjectId, {
                            subjectId: mark.subjectId,
                            subjectName: mark.subject.name,
                            marks: []
                        });
                    }
                    subjectMap.get(mark.subjectId).marks.push({
                        id: mark.id,
                        value: mark.mark,
                        date: mark.date
                    });
                });

                return {
                    studentId: student.user.id,
                    studentName: `${student.user.last_name} ${student.user.first_name}`,
                    subjects: Array.from(subjectMap.values())
                };
            });

            return res.json({
                groupName: groupName,
                students: studentsWithMarks.filter(student => student.subjects.length > 0)
            });
        } catch (e) {
            next(e);
        }
    }

    async getMarksByStudent(req, res, next) {
        try {
            const { email, subjectId } = req.query;

            if (!email || !subjectId) {
                return next(ApiError.badRequest("Email студента и ID предмета обязательны"));
            }

            const student = await Students.findOne({
                where: { '$user.email$': email },
                include: [
                    {
                        model: Users,
                        attributes: ['id', 'first_name', 'last_name', 'email'],
                        as: 'user'
                    },
                    {
                        model: Groups,
                        attributes: ['id', 'name'],
                        as: 'group'
                    }
                ]
            });

            if (!student) {
                return next(ApiError.badRequest('Студент не найден'));
            }

            if (!student.group_id) {
                return next(ApiError.badRequest('Студент не принадлежит ни к одной группе'));
            }

            const subjectInGroup = await GroupSubjectAssignments.findOne({
                where: {
                    groupId: student.group_id,
                    subjectId: subjectId
                }
            });

            if (!subjectInGroup) {
                return next(ApiError.forbidden('Предмет не доступен для студента'));
            }

            const marks = await Marks.findAll({
                where: {
                    studentId: student.id,
                    subjectId: subjectId
                },
                attributes: ['id', 'mark', 'date'],
                order: [['date', 'ASC']]
            });

            const subject = await Subjects.findByPk(subjectId);

            const result = {
                studentEmail: email,
                studentName: `${student.user.last_name} ${student.user.first_name}`,
                groupName: student.group.name,
                subjectId: parseInt(subjectId),
                subjectName: subject ? subject.name : 'Неизвестный предмет',
                marks: marks.map(mark => ({
                    id: mark.id,
                    value: mark.mark,
                    date: mark.date
                }))
            };

            res.json(result);
        } catch (e) {
            console.log(e)
            next(e);
        }
    }
}

module.exports = new MarksController();