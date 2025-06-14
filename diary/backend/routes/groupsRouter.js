const Router = require('express');
const router = new Router();
const GroupsController = require('../controllers/groupsController');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get('/all', GroupsController.getAllGroups);
router.post('/create', GroupsController.create);
router.delete('/delete', GroupsController.deleteGroup)
router.post('/edit', upload.single('excelImportFile'), GroupsController.edit)
router.get('/getOne', GroupsController.getOne)
router.post('/create-schedule', upload.single('excelImportFile'), GroupsController.createSchedule)
router.get('/get-schedule-by-group', GroupsController.getScheduleByGroup)
router.delete('/delete-schedule', GroupsController.deleteSchedule)
router.post('/edit-schedule', GroupsController.editSchedule)
router.get('/get-group-subjects', GroupsController.getGroupSubjects)

module.exports = router;