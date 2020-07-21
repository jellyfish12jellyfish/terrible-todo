const keys = require('../keys/index');

module.exports = function (email) {
    return {
        to: email,
        from: keys.MAIL_USER,
        subject: 'Ваш аккаунт успешно создан!',
        html: `
            <style>
            body {
                background: #f0f0f0;
            }
            </style>
            <h1>Добро пожаловать, ${email}</h1>
            <a href="${keys.BASE_URL}/todo">Перейти на наш сайт</a>
        `
    }
}