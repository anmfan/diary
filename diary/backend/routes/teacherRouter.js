const Router = require('express');
const router = new Router();
const TeacherController = require('../controllers/teacherController');

router.get('/all', TeacherController.getAllTeachers);
router.delete('/delete', TeacherController.deleteTeacher);
router.get('/get-subjects-by-teacher', TeacherController.getSubjectsByTeacher);
router.get('/get-teacher-dashboard', TeacherController.getTeacherDashboard);

module.exports = router;