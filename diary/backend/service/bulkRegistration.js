const XLSX = require('xlsx');
const {Users, Groups, Teachers, Students} = require("../models/models");
const {generateRandomPassword, generateUsername} = require("../helper");
const UserService = require("../service/userService");

class BulkRegistration {
    async handleBulkRegistration(file, transaction) {
        const workbook = XLSX.read(file.buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        const usersData = XLSX.utils.sheet_to_json(worksheet);

        const results = [];

        for (const data of usersData) {
            try {
                const { email, fullName, role_id, group_name } = data;

                const existingUser = await Users.findOne({ where: { email }, transaction });
                if (existingUser) {
                    results.push({ email, status: 'exists' });
                    continue;
                }

                let group = null;
                let group_id = null;

                if (group_name && Number(role_id) === 3) {
                    group = await Groups.findOne({ where: { name: group_name }, transaction });

                    group_id = group.id;
                }

                const password = generateRandomPassword();
                const username = generateUsername();

                const userData = await UserService.registration(
                    email,
                    password,
                    username,
                    Number(role_id),
                    group_id,
                    fullName,
                    transaction
                );

                results.push({
                    tokens: {
                        accessToken: userData.accessToken,
                        refreshToken: userData.refreshToken,
                    },
                    user: userData.user
                });

            } catch (err) {
                results.push({ email: data.email || 'неизвестно', status: 'error', error: err.message });
            }
        }

        return results;
    }
}

module.exports = new BulkRegistration();