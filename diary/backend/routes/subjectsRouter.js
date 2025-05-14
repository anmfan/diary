const Router = require('express');
const router = new Router();
const SubjectsController = require('../controllers/subjectsController');

router.get('/all', SubjectsController.getAllSubjects);
router.delete('/delete', SubjectsController.deleteSubject)
router.post('/create', SubjectsController.create)
router.post('/edit', SubjectsController.edit)

module.exports = router;