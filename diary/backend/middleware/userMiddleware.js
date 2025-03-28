const { check, validationResult } = require('express-validator');
const router = require("../routes");

const validateLogin = [
    check('email', 'Некорректный email').isEmail(),
    check('password', 'Пароль должен быть не менее 6 символов').isLength({min: 6}),
    (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next()
    }
]

module.exports = {
    validateLogin
};