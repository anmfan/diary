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

module.exports = router;