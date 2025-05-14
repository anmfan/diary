const Router = require('express');
const router = new Router();
const TeacherController = require('../controllers/teacherController');

router.get('/all', TeacherController.getAllTeachers);
router.delete('/delete', TeacherController.deleteTeacher)

module.exports = router;