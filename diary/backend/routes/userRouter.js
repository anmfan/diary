const Router = require('express');
const router = new Router();
const UserController = require('../controllers/userController');
const {validateLogin} = require("../middleware/userMiddleware");
const authMiddleware = require("../middleware/authMiddleware");
const {body} = require("express-validator");
const multer = require('multer');
const {uploadAvatar} = require("../multer-config");
const TeacherController = require("../controllers/teacherController");
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/login', ...validateLogin, UserController.login);
router.post('/register',
    upload.single('excelImportFile'),
    body('email').isEmail(),
    UserController.register);
router.post('/logout', UserController.logout);

router.get('/account', UserController.getAccount)
router.get('/admin-account', UserController.getAdminAccount)
router.get("/refresh", UserController.refresh);
router.post('/edit', UserController.edit);
router.post('/new-password', UserController.newPassword);
router.get('/get-admin-dashboard', TeacherController.getAdminDashboard);
router.patch('/avatar', authMiddleware, uploadAvatar.single('avatar'), UserController.updateAvatar);


module.exports = router;