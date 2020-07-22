const keys = require('../keys/index');

module.exports = function (email, name, message) {
    return {
        to: keys.MAIL_USER,
        from: keys.MAIL_USER,
        subject: `${email} отправил почту!`,
        html: `
<style>
p{
color: red;
}
</style>
        <h1>Форма для контакта</h1>
        <p>Имя: ${name}</p>
        <p>Почта: ${email}</p>
        <p>Сообщение: ${message}</p>
        <hr>
        `
    }
}