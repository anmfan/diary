const Router = require('express');
const router = new Router();
const MarksController = require('../controllers/marksController');

router.post('/add', MarksController.add)
router.post('/delete', MarksController.delete)
router.post('/get', MarksController.getAll)

module.exports = router;