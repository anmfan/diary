const jwt = require("jsonwebtoken");
const {Users} = require("../models/models");
require("dotenv").config();

class TokenService {
    generateTokens(payload) {
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
            expiresIn: '7d',
        });

        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
            expiresIn: '30d',
        });

        return { accessToken, refreshToken };
    }

    async saveToken(user_id, refreshToken, transaction = null) {
        return Users.update(
            { refresh_token: refreshToken },
            {
                where: { id: user_id },
                transaction,
                returning: true
            }
        );
    }

    async removeToken(refreshToken) {
        if (!refreshToken) return;
        return await Users.update(
            { refresh_token: null },
            { where: { refresh_token: refreshToken }}
        )
    }

    validateAccessToken(token) {
        try {
            return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        } catch (e) {
            return null;
        }
    }

    validateRefreshToken(token) {
        try {
            return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
        } catch (e) {
            return null;
        }
    }

    async findToken(refreshToken) {
        return await Users.findOne({where: {refresh_token: refreshToken}})
    }
}

module.exports = new TokenService;