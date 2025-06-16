const ApiError = require('../error/ApiError');
const {Users, Roles, Groups, Students, Marks, Schedule, Subjects, GroupSubjectAssignments, Teachers} = require("../models/models");
const UserService = require("../service/userService");
const {validationResult } = require("express-validator");
const sequelize = require('../db');
const {generateRandomPassword, generateUsername} = require("../helper");
const BulkRegistration = require("../service/bulkRegistration");
const {join} = require("node:path");
const {Op, Sequelize} = require("sequelize");
const mailService = require('../service/mailService');
const {hash} = require("bcrypt");

class UserController {
    async login(req, res, next) {
        try {
            const { email, password } = req.body;

            const userData = await UserService.login(email, password);

            res.cookie('refreshToken', userData.refreshToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: true,
            })

            return res.json({
                    message: "Пользователь авторизирован",
                    userData: {...userData}
                }
            );
        } catch (e) {
            console.log(e)
            return next(e);
        }
    }
    async register(req, res, next) {
        const transaction = await sequelize.transaction();
        try {
            if (req.file) {
                const results = await BulkRegistration.handleBulkRegistration(req.file, transaction);
                await transaction.commit();
                return res.json({
                    message: 'Массовая регистрация завершена',
                    results
                });
            }

            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                await transaction.rollback();
                return next(ApiError.badRequest('Ошибка при валидации', errors.array()))
            }

            const {
                email,
                role_id,
                group_id,
                group_name,
                fullName,
                format
            } = req.body;

            const candidate = await Users.findOne({where: {email}, transaction})
            if (candidate) {
                await transaction.rollback();
                return next(ApiError.badRequest(`Пользователь с адресом ${email} уже существует`));
            }

            let actualGroupId = group_id;

            if (!group_id && group_name && Number(role_id) === 3) {
                let group = await Groups.findOne({ where: { name: group_name }, transaction });

                actualGroupId = group.id;
            }

            const password = generateRandomPassword();
            const username = generateUsername();

            const userData = await UserService.registration(
                email,
                password,
                username,
                Number(role_id),
                actualGroupId,
                fullName,
                format,
                transaction
            );

            await transaction.commit();

            return res.json({
                message: "Пользователь зарегистрирован",
                userData: {...userData}
            }
            );
        } catch (e) {
            console.log(e)
            return next(e);
        }
    }

    async refresh(req, res, next) {
        try {
            const { refreshToken } = req.cookies;
            const userData = await UserService.refresh(refreshToken)
            res.cookie('refreshToken', userData.refreshToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: true,
            })
            return res.json({message: "Токен обновлен", userData: userData});
        } catch (e) {
            return next(e);
        }
    }

    async logout(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            await UserService.logout(refreshToken)
            res.clearCookie('refreshToken')
            return res.json({ message: "Выход выполнен" });
        } catch (e) {
            console.log(e)
            return next(e);
        }
    }

    async getAccount(req, res, next) {
        try {
            const { email } = req.query;

            if (!email) {
                return next(ApiError.badRequest("Email необходим"));
            }

            const user = await Users.findOne({
                where: { email },
            });

            if (!user) {
                return next(ApiError.badRequest("Пользователь не найден"));
            }

            if (user.role_id === 2) {
                const teacher = await Teachers.findOne({
                    where: { user_id: user.id },
                    attributes: ['id'],
                });

                if (!teacher) {
                    return next(ApiError.badRequest("Преподаватель не найден"));
                }

                const curatedGroups = await Groups.findAll({
                    where: { curator_id: teacher.id },
                    attributes: ['id', 'name', 'course', 'students_count'],
                });

                const subjects = await Subjects.findAll({
                    include: [{
                        model: Teachers,
                        where: { id: teacher.id },
                        attributes: [],
                        through: { attributes: [] }
                    }],
                    attributes: ['id', 'name', 'classroom']
                });

                const groupSubjectAssignments = await GroupSubjectAssignments.findAll({
                    where: { teacherId: teacher.id },
                    include: [
                        {
                            model: Groups,
                            attributes: ['id', 'name', 'course', 'students_count']
                        },
                        {
                            model: Subjects,
                            attributes: ['id', 'name']
                        }
                    ],
                    attributes: []
                });

                const groupsTeachingSubjectsRaw = groupSubjectAssignments.map(gsa => ({
                    group: gsa.group,
                    subject: gsa.subject
                }));

                const seenGroupIds = new Set();
                const groupsTeachingSubjects = groupsTeachingSubjectsRaw.filter(item => {
                    const id = item.group.id;
                    if (seenGroupIds.has(id)) return false;
                    seenGroupIds.add(id);
                    return true;
                });

                return res.json({
                    curatedGroups,
                    subjects,
                    groupsTeachingSubjects
                });
            }

            const student = await Students.findOne({
                where: { user_id: user.id },
                attributes: ['id', 'group_id']
            });

            if (!student) {
                return next(ApiError.badRequest("Студент не найден"));
            }

            let groupName = 'Не назначена';
            if (student.group_id) {
                const group = await Groups.findOne({
                    where: { id: student.group_id },
                    attributes: ['name']
                });
                groupName = group ? group.name : groupName;
            } else {
                return res.json({
                    groupName,
                    attendance: {
                        totalLessons: 0,
                        absences: 0,
                        attendancePercentage: 0
                    },
                    averageMark: 0
                });
            }

            const today = new Date().toISOString().split('T')[0];
            const allLessons = await Schedule.findAll({
                where: {
                    groupId: student.group_id,
                    date: { [Op.lte]: today }
                },
                attributes: ['id', 'date', 'lesson_number', 'subjectId'],
                raw: true
            });

            const studentMarks = await Marks.findAll({
                where: {
                    studentId: student.id
                },
                attributes: ['mark', 'date'],
                raw: true
            });

            const formattedMarksDates = studentMarks.map(mark => ({
                date: new Date(mark.date).toISOString().split('T')[0],
                mark: mark.mark
            }));

            const lessonsDatesSet = new Set(allLessons.map(lesson => new Date(lesson.date).toISOString().split('T')[0]));
            const datesWithMarkOrN = new Set(
                formattedMarksDates
                    .filter(m => m.mark === 'н' || /^[1-5]$/.test(m.mark))
                    .map(m => m.date)
            );

            const totalLessons = Array.from(lessonsDatesSet).filter(date => datesWithMarkOrN.has(date)).length;



            // const marksMap = new Map();
            // marks.forEach(mark => {
            //     const dateKey = new Date(mark.date).toISOString().split('T')[0];
            //     if (!marksMap.has(dateKey)) marksMap.set(dateKey, []);
            //     marksMap.get(dateKey).push(mark.mark);
            // });

            let absences = 0;
            let totalMarks = 0;
            let sumMarks = 0;

            formattedMarksDates.forEach(mark => {
                if (mark.mark === 'н') {
                    absences++;
                } else if (/^[1-5]$/.test(mark.mark)) {
                    totalMarks++;
                    sumMarks += parseInt(mark.mark);
                }
            });


            const averageMark = totalMarks > 0 ? (sumMarks / totalMarks) : 0;
            const attendancePercentage = totalLessons > 0
                ? Math.round(((totalLessons - absences) / totalLessons) * 100)
                : 0;

            res.json({
                groupName,
                attendance: {
                    totalLessons,
                    absences,
                    attendancePercentage
                },
                averageMark: Number(averageMark.toFixed(2))
            });
        } catch (e) {
            console.log(e);
            next(e);
        }
    }

    async edit(req, res, next) {
        try {
            const { id, email, fullName } = req.body;

            if (!email && !fullName) {
                return next(ApiError.badRequest("Нужно указать хотя бы одно поле для обновления"));
            }

            const user = await Users.findByPk(id);
            if (!user) {
                return next(ApiError.badRequest("Пользователь не найден"));
            }

            let isSameEmail = true;
            let isSameFullName = true;

            if (email && email !== user.email) {
                const existingUser = await Users.findOne({ where: { email } });
                if (existingUser && existingUser.id !== user.id) {
                    return next(ApiError.badRequest(`Email ${email} уже используется`));
                }
                isSameEmail = false;
            }

            let first_name, last_name;
            if (fullName) {
                const parts = fullName.trim().split(" ");
                first_name = parts[0];
                last_name = parts.slice(1).join(" ");
                const currentFullName = `${user.first_name} ${user.last_name}`.trim();
                isSameFullName = fullName.trim() === currentFullName;
            }

            if (isSameEmail && isSameFullName) {
                return next(ApiError.badRequest("Новые данные совпадают с текущими"));
            }

            if (!isSameEmail) {
                user.email = email;
            }

            if (!isSameFullName) {
                user.first_name = first_name;
                user.last_name = last_name;
            }

            await user.save();

            const responseUser = {
                id: user.id,
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
            };

            if (user.role_id === 2) {
                responseUser.teacher = "teacher";
            }

            return res.json({
                message: "Данные пользователя обновлены",
                user: responseUser
            });
        } catch (e) {
            return next(e);
        }
    }

    async updateAvatar(req, res, next) {
        try {
            if (!req.file) {
                return res.status(400).json({ message: 'Файл не загружен' });
            }
            if (!req.user || !req.user.id) {
                return res.status(401).json({ message: 'Не авторизован' });
            }

            const userId = req.user.id;
            const newFilename = req.file.filename;
            const newAvatarPath = `/avatars/${newFilename}`;

            const user = await Users.findByPk(userId);
            if (!user) {
                return res.status(404).json({ message: 'Пользователь не найден' });
            }

            const oldAvatarPath = user.avatar;

            user.avatar = newAvatarPath;
            await user.save();

            if (oldAvatarPath) {
                try {
                    const oldFilename = oldAvatarPath.split('/').pop();
                    const oldFilePath = join(__dirname, '../uploads/avatars', oldFilename);

                    await fs.unlink(oldFilePath);
                } catch (deleteError) {
                    console.error('Ошибка при удалении старого аватара:', deleteError);
                }
            }

            res.json({
                success: true,
                avatar: newAvatarPath,
                message: 'Аватар успешно обновлен'
            });

        } catch (error) {
            console.error('Ошибка при обновлении аватара:', error);
            res.status(500).json({ message: 'Ошибка сервера' });
        }
    }

    async newPassword (req, res, next) {
        try {
            const { email } = req.query;

            if (!email) {
                return next(ApiError.badRequest("Email обязателен"))
            }

            const user = await Users.findOne({ where: { email } });
            if (!user) {
                return next(ApiError.badRequest("Пользователь с таким email не найден"))
            }

            const newPassword = generateRandomPassword();

            const hashedPassword = await hash(newPassword, 10);

            await user.update({ password: hashedPassword });

            await mailService.sendRegistrationMail(email, newPassword);

            res.status(200).json({
                message: 'Новый пароль был отправлен на вашу электронную почту',
                emailSent: true
            });
        } catch (e) {
            next(e)
        }
    }

    async getAdminAccount (req, res, next) {
        try {
            const groupsCount = await Groups.count();
            const teachersCount = await Teachers.count();
            const studentsCount = await Students.count();
            const subjectsCount = await Subjects.count();

            return res.status(200).json({ groupsCount, teachersCount, studentsCount, subjectsCount });
        } catch (e) {
            console.log(e)
            next(e)
        }
    }
}

module.exports = new UserController();