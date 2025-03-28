const Router = require('express');
const router = new Router();
const UserController = require('../controllers/userController');
const {validateLogin} = require("../middleware/userMiddleware");
const authMiddleware = require("../middleware/authMiddleware");

router.post('/login', ...validateLogin, UserController.login);
router.post('/register', UserController.register);
router.post('/logout', UserController.logout);
router.post('/check', authMiddleware, UserController.check)

router.get('/account', authMiddleware, UserController.check)
router.post("/refresh", UserController.refresh);


module.exports = router;