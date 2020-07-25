const {Router} = require('express');
const router = Router();
const auth = require('../middleware/auth');
const User = require('../models/user');
const Todo = require('../models/todo');
const {validationResult} = require('express-validator');
const {nameValidators} = require('../utils/validators');


router.get('/', (req, res) => {
    res.render('index', {
        title: 'Главная',
        isHome: true,
        sendContactEmailError: req.flash('sendContactEmailError'),
        success: req.flash('success')
    });
});

router.get('/profile', auth, (req, res) => {
    res.render('profile', {
        title: 'Профиль',
        isProfile: true,
        user: req.user.toObject(),
        error: req.flash('error')
    });
});

router.post('/profile', auth, nameValidators, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            req.flash('error', errors.array()[0].msg);
            return res.status(422).redirect('/profile/#profile');
        }


        const user = await User.findById(req.user._id);
        const toChange = {
            name: req.body.name
        };

        // console.log(req.file);
        if (req.file) {
            toChange.avatarUrl = req.file.path;
        }

        Object.assign(user, toChange);
        await user.save();
        res.redirect('/profile');

    } catch (e) {
        console.log(e);
    }
});

router.get('/chart', auth, async (req, res) => {
    try {
        const todo = await Todo.find();
        let todoLength = todo.length;

        res.render('chart', {
            title: 'График',
            isChart: true,
            todoLength,
            todo,
            userId: req.user ? req.user._id.toString() : null,
        });
    } catch (e) {
        console.log(e);
    }
});


module.exports = router;