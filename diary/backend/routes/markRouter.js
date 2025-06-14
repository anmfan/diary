const Router = require('express');
const router = new Router();
const MarksController = require('../controllers/marksController');

router.post('/add', MarksController.add)
router.delete('/delete', MarksController.delete)
router.get('/get-by-teacher', MarksController.getMarksByTeacher)
router.get('/get-by-student', MarksController.getMarksByStudent)

module.exports = router;