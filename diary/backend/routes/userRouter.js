const Router = require('express');
const router = new Router();
const UserController = require('../controllers/userController');
const {validateLogin} = require("../middleware/userMiddleware");
const authMiddleware = require("../middleware/authMiddleware");
const {body} = require("express-validator");
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/login', ...validateLogin, UserController.login);
router.post('/register',
    upload.single('excelImportFile'),
    body('email').isEmail(),
    UserController.register);
router.post('/logout', UserController.logout);

router.get('/account', authMiddleware, UserController.getAccount)
router.get("/refresh", UserController.refresh);
router.post('/edit', UserController.edit)

module.exports = router;