const TokenService = require("../service/tokenService");
const ApiError = require("../error/ApiError");

module.exports = function (req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return next(ApiError.unauthorized());
        }

        const accessToken = authHeader.split(" ")[1];
        if (!accessToken) {
            return next(ApiError.unauthorized());
        }

        const userData = TokenService.validateAccessToken(accessToken);
        if (!userData) {
            return next(ApiError.unauthorized());
        }

        req.user = userData;
        next();
    } catch (e) {
        return next(ApiError.unauthorized());
    }
};
