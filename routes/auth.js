const {Router} = require('express');
const router = Router();
const User = require('../models/user');
const keys = require('../keys/index');
const crypto = require('crypto');
const regEmail = require('../emails/registration');
const resetEmail = require('../emails/reset');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const {validationResult} = require('express-validator');
const {registerValidators} = require('../utils/validators');
const {resetPasswordValidators} = require('../utils/validators');
const {resetPasswordWithEmailValidators} = require('../utils/validators');


const transporter = nodemailer.createTransport({
    host: 'smtp.mail.ru',
    port: 587,
    secure: false,
    auth: {
        user: keys.MAIL_USER,
        pass: keys.MAIL_PASS,
    }
});

router.get('/login', async (req, res) => {
    res.render('auth/login', {
        title: 'Авторизация',
        isLogin: true,
        loginError: req.flash('loginError')
    });
});

router.get('/logout', async (req, res) => {
    req.session.destroy(() => {
        res.redirect('/auth/login');
    });
});

router.get('/register', async (req, res) => {
    res.render('auth/register', {
        title: 'Регистрация',
        isRegister: true,
        registerError: req.flash('registerError')
    });
});


router.post('/login', async (req, res) => {
    try {
        const {email, password} = req.body;
        const candidate = await User.findOne({email});

        if (candidate) {
            const areSame = await bcrypt.compare(password, candidate.password);

            if (areSame) {
                req.session.user = candidate;
                req.session.isAuthenticated = true;
                req.session.save(err => {
                    if (err) {
                        throw err;
                    }
                    res.redirect('/todo');
                });
            } else {
                req.flash('loginError', 'Неверный пароль');
                res.redirect('/auth/login');
            }
        } else {
            req.flash('loginError', 'Пользователь с таким email не существует')
            res.redirect('/auth/login');
        }

    } catch (e) {
        console.log(e);
    }
});

router.post('/register', registerValidators, async (req, res) => {
    try {
        const {email, password, name} = req.body;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            req.flash('registerError', errors.array()[0].msg);
            return res.status(422).redirect('/auth/register');
        }

        const hashPassword = await bcrypt.hash(password, 10);
        const user = new User({
            email,
            name,
            password: hashPassword
        });
        await user.save();
        res.redirect('/auth/login');
        await transporter.sendMail(regEmail(email));
    } catch (e) {
        console.log(e);
    }
});

router.get('/reset', (req, res) => {
    res.render('auth/reset', {
        title: 'Восстановить доступ',
        error: req.flash('error')
    });
});


const random = Math.random().toString(16).substring(7);


router.get(`/reset-success/:${random}`, async (req, res) => {
    try {
        await res.render('auth/reset-success', {
            title: 'Успех!',
            error: req.flash('error')
        });

    } catch (e) {
        console.log(e)
    }
});

router.post('/reset', resetPasswordWithEmailValidators, (req, res) => {

    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            req.flash('error', errors.array()[0].msg);
            return res.status(422).redirect('/auth/reset');
        }

        crypto.randomBytes(32, async (err, buffer) => {
            if (err) {
                req.flash('error', 'Что-то пошло не так, попробуйте снова');
                return res.redirect('/auth/reset');
            }
            const token = buffer.toString('hex');
            const candidate = await User.findOne({email: req.body.email});

            if (candidate) {
                candidate.resetToken = token;
                candidate.resetTokenExp = Date.now() + 60 * 60 * 1000;
                await candidate.save();
                await transporter.sendMail(resetEmail(candidate.email, token));
                return res.redirect(`/auth/reset-success/:${random}`)
            } else {
                req.flash('error', 'Email адрес не найден');
                res.redirect('/auth/reset');
            }
        });
    } catch (e) {
        console.log(e);
    }
});

router.get('/password/:token', async (req, res) => {
    if (!req.params.token) {
        return res.redirect('/auth/login');
    }

    try {
        const user = await User.findOne({
            resetToken: req.params.token,
            resetTokenExp: {$gt: Date.now()}
        });

        if (!user) {
            return res.redirect('/auth/login');
        } else {
            res.render('auth/password', {
                title: 'Восстановить доступ',
                error: req.flash('error'),
                userId: user._id.toString(),
                token: req.params.token
            });
        }
    } catch (e) {
        console.log(e)
    }
});

router.post('/password', resetPasswordValidators, async (req, res) => {
    try {
        const user = await User.findOne({
            _id: req.body.userId,
            resetToken: req.body.token,
            resetTokenExp: {$gt: Date.now()}
        });

        const {password} = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            req.flash('error', errors.array()[0].msg);
            return res.status(422).redirect('/auth/password/' + req.body.token);
        }

        if (user) {
            user.password = await bcrypt.hash(req.body.password, 10);
            user.resetToken = undefined;
            user.resetTokenExp = undefined;
            await user.save();
            res.redirect('/auth/login');
        } else {
            req.flash('loginError', 'Время жизни токена истекло');
            res.redirect('/auth/login');
        }
    } catch (e) {
        console.log(e);
    }
})

module.exports = router;