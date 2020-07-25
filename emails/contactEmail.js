const keys = require('../keys/index');

module.exports = function (email, name, message) {
    return {
        to: keys.MAIL_USER,
        from: keys.MAIL_USER,
        subject: `${email} отправил почту!`,
        html: `
         <style>
         span{
         font-weight: bold;
         }
</style>
         
        <h1>Форма для контакта</h1>
        <p><span>Имя:</span> ${name}</p>
        <p><span>Почта:</span> ${email}</p>
        <p><span>Сообщение:</span> ${message}</p>
        <hr>
        `
    }
}