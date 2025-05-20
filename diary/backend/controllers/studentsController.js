const {Users, Subjects, Students, Groups} = require("../models/models");
const ApiError = require("../error/ApiError");
const sequelize = require('../db');

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

            await student.destroy({ transaction });

            await Users.destroy({
                where: { id },
                transaction
            });

            await transaction.commit();
            return res.json({message: "Студент успешно удалён"})
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

            if (!student) {
                return next(ApiError.badRequest("Студент не найден"))
            }

            const group = await Groups.findByPk(groupId);
            if (!group) {
                return next(ApiError.badRequest("Группа не найдена"))
            }

            if (student.group_id === groupId) {
                return res.status(400).json({ message: 'Студент уже прикреплён к этой группе' });
            }

            student.group_id = groupId;
            await student.save();

            group.students_count += 1;
            await group.save();

            return res.json({
                    message: 'Студент прикреплён к группе',
                    studentId: student.id
                });
        } catch (e) {
            return next(e);
        }
    }

    async removeGroup(req, res, next) {
        try {
            const { user_id } = req.body;

            const userId = user_id;

            if (!userId) {
                return res.status(400).json({ message: 'userId обязателен' });
            }

            const student = await Students.findOne({ where: { user_id: userId } });

            if (!student) {
                return res.status(404).json({ message: 'Студент не найден' });
            }

            if (!student.group_id) {
                return res.status(400).json({ message: 'Студент не прикреплён к группе' });
            }

            const oldGroup = await Groups.findByPk(student.group_id);

            student.group_id = null;
            await student.save();

            if (oldGroup && oldGroup.students_count > 0) {
                oldGroup.students_count -= 1;
                await oldGroup.save();
            }

            return res.json({
                    message: 'Студент успешно откреплён от группы',
                    deletedStudentId: userId,
                    studentsGroup: oldGroup.id,
                    students_count: oldGroup.students_count,
            });
        } catch (e) {
            return next(e)
        }
    }
}

module.exports = new StudentsService();