require('dotenv').config();
const nodemailer = require('nodemailer');

class MailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: 'smtp.mail.ru',
            port: 587,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD,
            },
            logger: true,
            debug: true
        });

        this.transporter.verify(function(error, success) {
            if (error) {
                console.error('Ошибка подключения к SMTP:', error);
            } else {
                console.log('Подключение к SMTP серверу успешно');
            }
        });
    }

    async sendRegistrationMail(to, password) {
        const htmlContent = `
            <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 30px;">
                <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);">
                    <h2 style="color: #333333;">Добро пожаловать!</h2>
                    <p style="font-size: 16px; color: #555555;">Вы успешно зарегистрировались в системе <strong>электронного дневника Diary</strong>.</p>
                    <hr style="margin: 20px 0; border: none; border-top: 1px solid #dddddd;">
                    <p style="font-size: 16px; color: #333333;">Ваши данные для входа:</p>
                    <ul style="font-size: 16px; color: #555555; padding-left: 20px;">
                        <li><strong>Email:</strong> ${to}</li>
                        <li><strong>Пароль:</strong> ${password}</li>
                    </ul>
                    <p style="font-size: 14px; color: #999999;">Пожалуйста, не передавайте эти данные третьим лицам.</p>
                    <div style="margin-top: 30px; font-size: 13px; color: #aaaaaa; text-align: center;">
                        © ${new Date().getFullYear()} Электронный дневник
                    </div>
                </div>
            </div>
        `;
        try {
            const info = await this.transporter.sendMail({
                from: process.env.SMTP_USER,
                to,
                subject: 'Регистрация в системе электронного дневника',
                text: `Добро пожаловать!\n\nВаши данные для входа:\nEmail: ${to}\nПароль: ${password}\n`,
                html: htmlContent,
            });
            console.log('Письмо отправлено:', info);
        } catch (error) {
            console.error('Ошибка при отправке письма:', error);
            throw error;
        }
    }
}

module.exports = new MailService();