require('dotenv').config();
const db = require('./db');

(async () => {
    try {
        await db.authenticate();
        console.log('✅ Подключение к БД прошло успешно');
    } catch (e) {
        console.error('❌ Ошибка подключения:', e.message);
    }
})();
