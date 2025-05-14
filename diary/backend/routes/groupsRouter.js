const Router = require('express');
const router = new Router();
const GroupsController = require('../controllers/groupsController');

router.get('/all', GroupsController.getAllGroups);
router.post('/create', GroupsController.create);
router.delete('/delete', GroupsController.deleteGroup)
router.post('/edit', GroupsController.edit)

module.exports = router;