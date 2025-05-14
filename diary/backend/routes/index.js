const Router = require('express');
const router = new Router();
const userRouter = require('./userRouter');
const markRouter = require('./markRouter');
const teacherRouter = require('./teacherRouter');
const studentsRouter = require('./studentRouter');
const groupsRouter = require('./groupsRouter');
const subjectsRouter = require('./subjectsRouter');

router.use('/user', userRouter);
router.use('/mark', markRouter);
router.use('/teachers', teacherRouter)
router.use('/students', studentsRouter)
router.use('/groups', groupsRouter)
router.use('/subjects', subjectsRouter)

module.exports = router;