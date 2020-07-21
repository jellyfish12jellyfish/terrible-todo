const keys = require('../keys/index');

module.exports = function (email, token) {
    return {
        to: email,
        from: keys.MAIL_USER,
        subject: 'Восстановление доступа к аккаунту',
        html: `
        <h1>Здравствуйте!</h1>
        <p>Вы получили это письмо потому, что кто-то пытается получить доступ к вашему аккаунту, если это не вы, то просим вас поменять пароль на более надежный!</p>
        <p><b>В ином случае вот ваша ссылка для восстановления доступа:</b></p>
        <p><a href="${keys.BASE_URL}/auth/password/${token}">изменить пароль</a></p>
        `
    }
}