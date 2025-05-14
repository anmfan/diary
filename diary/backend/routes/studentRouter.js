const Router = require('express');
const router = new Router();
const StudentsController = require('../controllers/studentsController');

router.get('/all', StudentsController.getAllStudents);
router.delete('/delete', StudentsController.deleteStudent)
router.post('/add-group', StudentsController.addGroup)
router.post('/remove-group', StudentsController.removeGroup)

module.exports = router;