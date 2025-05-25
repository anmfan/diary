const Router = require('express');
const router = new Router();
const SubjectsController = require('../controllers/subjectsController');
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get('/all', SubjectsController.getAllSubjects);
router.delete('/delete', SubjectsController.deleteSubject)
router.post('/create', SubjectsController.create)
router.post('/edit', upload.single('excelImportFile'), SubjectsController.edit)

module.exports = router;