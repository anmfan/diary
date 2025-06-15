const {Groups, Teachers, Users, Students, Schedule, GroupSubjectAssignments, Subjects} = require("../models/models");
const ApiError = require("../error/ApiError");
const XLSX = require('xlsx');
const dayjs = require('dayjs');
const {Op} = require("sequelize");
const isoWeek = require('dayjs/plugin/isoWeek');
dayjs.extend(isoWeek);

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
                return next(ApiError.badRequest("Группа не найдена"))
            }

            const oldGroupName = group.name;
            if (newGroupName) {
                group.name = newGroupName;
                await group.save();
            }

            const successfullyAdded = [];
            const skipped = [];

            if (file) {
                const workbook = XLSX.read(file.buffer, { type: 'buffer' });
                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];
                const studentsFromExcel = XLSX.utils.sheet_to_json(sheet);

                for (const studentData of studentsFromExcel) {
                    const { email } = studentData;

                    if (!email) {
                        skipped.push({ reason: 'Нет email', data: studentData });
                        continue;
                    }

                    const user = await Users.findOne({ where: { email } });
                    if (!user) {
                        skipped.push({ reason: 'Пользователь не найден', email });
                        continue;
                    }

                    if (user.role_id !== 3) {
                        skipped.push({ reason: 'Пользователь не является студентом', email });
                        continue;
                    }

                    const student = await Students.findOne({ where: { user_id: user.id } });
                    if (!student) {
                        skipped.push({ reason: 'Студентская запись не найдена', email });
                        continue;
                    }

                    if (student.group_id) {
                        skipped.push({ reason: 'Студент уже состоит в группе', email });
                        continue;
                    }

                    student.group_id = groupId;
                    await student.save();

                    successfullyAdded.push({
                        user_id: user.id,
                        user: {
                            first_name: user.first_name,
                            last_name: user.last_name,
                            email: user.email
                        }
                    });
                }
            }

            const addedCount = successfullyAdded.length;
            group.students_count = group.students_count + addedCount;
            await group.save();

            const { created_at, updated_at, ...updated } = group.toJSON();

            return res.json({
                message: 'Группа обновлена',
                updated,
                oldGroupName,
                successfullyAdded,
                skipped
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

            const groups = await Groups.findAll({
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
                        attributes: ['user_id', 'format'],
                        include: [{
                            model: Users,
                            attributes: ['first_name', 'last_name', 'email']
                        }]
                    }
                ]
            });

            if (!groups) {
                return res.json(null)
            }

            return res.json(groups);
        } catch (err) {
            next(err)
        }
    }

    async createSchedule(req, res, next) {
        try {
            const { groupId } = req.body;
            const file = req.file;

            const numericGroupId = Number(groupId);

            if (!numericGroupId || !file) {
                return next(ApiError.badRequest('Файл или группа не указаны'));
            }

            const workbook = XLSX.read(file.buffer, { type: 'buffer' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });

            let weekOffset = 0;
            const rawWeekOffset = worksheet[0][0];

            if (typeof rawWeekOffset === 'number' && Number.isInteger(rawWeekOffset)) {
                weekOffset = rawWeekOffset;
            } else if (typeof rawWeekOffset === 'string' && /^-?\d+$/.test(rawWeekOffset.trim())) {
                weekOffset = parseInt(rawWeekOffset.trim(), 10);
            } else {
                return next(ApiError.badRequest('В ячейке A1 должно быть целое число (смещение по неделям)'));
            }

            const startOfWeek = dayjs().startOf('isoWeek').add(weekOffset, 'week');

            const weekDates = Array.from({ length: 5 }, (_, i) =>
                startOfWeek.add(i, 'day').format('YYYY-MM-DD')
            );

            const result = [];

            for (let row = 1; row < worksheet.length; row++) {
                for (let col = 1; col <= 5; col++) {
                    const cell = worksheet[row][col];
                    if (!cell || cell === '—') continue;

                    const lesson_number = row;
                    const dayOffset = col - 1;
                    const date = weekDates[dayOffset]

                    const cleaned = typeof cell === 'string' ? cell.trim() : String(cell).trim();

                    let subjectIdentifier = cleaned;
                    let classroom = null;

                    const separatorIndex = cleaned.search(/[, ]/);
                    if (separatorIndex !== -1) {
                        subjectIdentifier = cleaned.substring(0, separatorIndex).trim();
                        classroom = cleaned.substring(separatorIndex + 1).trim();

                        classroom = classroom.replace(/^[, ]+/, '').replace(/[, ]+$/, '');
                    }

                    let subject = null;

                    if (/^\d+$/.test(subjectIdentifier)) {
                        subject = await Subjects.findOne({
                            where: { id: parseInt(subjectIdentifier) }
                        });
                    } else {
                        subject = await Subjects.findOne({
                            where: { name: subjectIdentifier }
                        });
                    }

                    if (!subject) continue;

                    const isSubjectAssigned = await GroupSubjectAssignments.findOne({
                        where: {
                            groupId: numericGroupId,
                            subjectId: subject.id
                        }
                    });

                    if (!isSubjectAssigned) continue;

                    if (!classroom && subject.classroom) {
                        classroom = subject.classroom;
                    }

                    result.push({
                        groupId,
                        date,
                        lesson_number,
                        subjectId: subject.id,
                        classroom: classroom,
                        teacherId: isSubjectAssigned.teacherId
                    });
                }
            }

            const deleteConditions = result.map(item => ({
                groupId: numericGroupId,
                date: item.date,
                lesson_number: item.lesson_number
            }));

            if (deleteConditions.length > 0) {
                await Schedule.destroy({
                    where: {
                        [Op.or]: deleteConditions
                    }
                });
            }

            await Schedule.bulkCreate(result);

            const createdSchedules = await Schedule.findAll({
                where: {
                    groupId: numericGroupId,
                    date: {
                        [Op.in]: weekDates
                    },
                    lesson_number: {
                        [Op.in]: result.map(r => r.lesson_number)
                    }
                },
                include: [
                    {
                        model: Subjects,
                        as: 'subject',
                        attributes: ['name']
                    },
                    {
                        model: Teachers,
                        as: 'teacher',
                        attributes: ['user_id'],
                        include: [
                            {
                                model: Users,
                                as: 'user',
                                attributes: ['first_name', 'last_name']
                            }
                        ]
                    }
                ]
            });


            return res.json({
                message: 'Расписание добавлено',
                count: result.length,
                createdSchedules,
                details: `Добавлено ${result.length} занятий`
            });
        } catch (e) {
            next(e);
        }
    }

    async getScheduleByGroup(req, res, next) {
        try {
            const { groupId, weekOffset } = req.query;

            if (!groupId) {
                return next(ApiError.badRequest('Не указан ID группы'));
            }

            let dateCondition = {};

            if (typeof weekOffset !== 'undefined') {
                const parsedWeekOffset = parseInt(weekOffset);
                const validOffset = isNaN(parsedWeekOffset) ? 0 : parsedWeekOffset;

                const startOfWeek = dayjs().add(validOffset, 'week').startOf('isoWeek');
                const endOfWeek = startOfWeek.add(4, 'day').endOf('day');

                dateCondition = {
                    date: {
                        [Op.between]: [startOfWeek.toDate(), endOfWeek.toDate()],
                    }
                };
            }

            const schedule = await Schedule.findAll({
                where: {
                    groupId,
                    ...dateCondition
                },
                include: [
                    {
                        model: Subjects,
                        attributes: ['id', 'name'],
                    },
                    {
                        model: Teachers,
                        attributes: ['id'],
                        include: [{
                            model: Users,
                            attributes: ['id', 'first_name', "last_name"]
                        }]
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

    async deleteSchedule(req, res, next) {
        try {
            const { selectedSubjectId, selectedDay, groupId } = req.body;

            const numericSelectedSubjectId = Number(selectedSubjectId)
            const numericGroupId = Number(groupId);

            if (!numericSelectedSubjectId || !selectedDay || !numericGroupId) {
                return next(ApiError.badRequest("Недостаточно данных для удаления расписания"));
            }

            const lesson = await Schedule.findOne({
                where: {
                    subjectId: numericSelectedSubjectId,
                    date: selectedDay,
                    groupId: numericGroupId,
                },
            });

            if (!lesson) {
                return next(ApiError.badRequest("Пара не найдена"));
            }

            await lesson.destroy();

            return res.json({
                message: "Пара успешно удалена",
                lesson: {
                    numericSelectedSubjectId,
                    selectedDay
                }
            });
        } catch (e) {
            next(e)
        }
    }

    async editSchedule(req, res, next) {
        try {
            const { selectedSubjectId, selectedDay, groupId, classroom, lesson_number } = req.body;

            const numericSelectedSubjectId = Number(selectedSubjectId);
            const numericGroupId = Number(groupId);

            if (!numericSelectedSubjectId || !selectedDay || !numericGroupId || !classroom) {
                return next(ApiError.badRequest("Недостаточно данных для редактирования расписания"));
            }

            const lesson = await Schedule.findOne({
                where: {
                    subjectId: numericSelectedSubjectId,
                    date: selectedDay,
                    groupId: numericGroupId,
                    lesson_number
                },
            });

            if (!lesson) {
                return next(ApiError.badRequest("Пара не найдена"));
            }

            lesson.classroom = classroom;
            await lesson.save();

            return res.json({
                message: "Аудитория успешно обновлена",
                lesson
            });
        } catch (e) {
            next(e)
        }
    }

    async getGroupSubjects(req, res, next) {
        try {
            const groupId = req.query.id;

            if (!groupId) {
                return next(ApiError.badRequest("ID группы обязательно"));
            }

            const subjects = await GroupSubjectAssignments.findAll({
                where: { groupId },
                include: [
                    {
                        model: Subjects,
                        attributes: ['id', 'name']
                    }
                ],
                distinct: true,
                attributes: []
            });

            const uniqueSubjects = subjects.map(assignment => ({
                subjectId: assignment.subject.id,
                subjectName: assignment.subject.name
            }));

            res.json(uniqueSubjects);
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new GroupsService();