const TokenService = require("../controllers/tokenService");
const ApiError = require("../error/ApiError");

module.exports = function (req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return next(ApiError.forbidden("Токен не предоставлен"));
        }

        const token = authHeader.split(" ")[1];
        if (!token) {
            return next(ApiError.forbidden("Некорректный формат токена"));
        }

        const userData = TokenService.validateAccessToken(token);
        if (!userData) {
            return next(ApiError.forbidden("Токен недействителен"));
        }

        req.user = userData;
        next();
    } catch (e) {
        return next(ApiError.internal("Ошибка авторизации"));
    }
};
