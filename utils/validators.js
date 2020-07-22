const {body} = require('express-validator');

const User = require('../models/user');

exports.registerValidators = [
    body('email').isEmail().withMessage("Введите корректный email адрес")
        .custom(async (value, {req}) => {
            try {
                const user = await User.findOne({email: value});
                if (user) {
                    return Promise.reject('Этот email уже существует');
                }
            } catch (e) {
                console.log(e);
            }
        })
        .normalizeEmail(),

    body('password', 'Пароль должен быть не менее 8 символов')
        .isLength({min: 8, max: 50})
        .isAlphanumeric().trim(),

    body('confirm').custom((value, {req}) => {
        if (value !== req.body.password) {
            throw new Error("Пароли не совпадают");
        }
        return true;
    }).trim(),

    body('name', 'Имя должно быть не менее 3 символов').isLength({min: 3, max: 50})
        .trim()
];

exports.todoValidators = [
    body('title', 'Не менее 3 символов').isLength({min: 3, max: 100}).trim()
];


exports.resetPasswordValidators = [
    body('password', 'Пароль должен быть не менее 8 символов')
        .isLength({min: 8, max: 50})
        .isAlphanumeric().trim()
];

exports.sendContactEmailValidators = [
    body('email').isEmail().withMessage("Введите корректный email адрес")
        .normalizeEmail().trim(),

    body('name', 'Имя должно быть не менее 3 символов').isLength({min: 3, max: 50})
        .trim(),

    body('message', 'Длина сообщения минимум 10 символов').isLength({
        min: 10, max: 250
    }).trim()
];

exports.resetPasswordWithEmailValidators = [
    body('email').isEmail().withMessage('Введите корректный email адрес')
        .normalizeEmail().trim()
];