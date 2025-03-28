const ApiError = require('../error/ApiError');

class AccountController {
    async getAccount(req, res, next) {
        try {

        } catch (e) {
            return next(ApiError.internal(e.message));
        }
    }
}

module.exports = new UserController();