const keys = require('../keys/index');

module.exports = function (email) {
    return {
        to: email,
        from: keys.MAIL_USER,
        subject: 'Ваш аккаунт успешно создан!',
        html: `
            <style>
                a{
                padding: 10px;
                border-radius: 5px;
                background-color: #afafaf;
                color: white;
                }
                .wrapper{
                text-align: center;
                max-width: 400px;
                margin: 0 auto;
                }
            </style>
            <div class="wrapper">
            <h1>Добро пожаловать, ${email}</h1>
            <p>Поздравляем с успешной регистрацией!</p>
            <p>Если возникнут вопросы, то пишите смело нам!</p>
            <hr>
            <br>
            <a href="${keys.BASE_URL}/todo">Перейти на наш сайт</a>
            </div>
        `
    }
}