const Router = require('express');
const router = new Router();
const userRouter = require('./userRouter');
const markRouter = require('./markRouter');

router.use('/user', userRouter);
router.use('/mark', markRouter);

module.exports = router;