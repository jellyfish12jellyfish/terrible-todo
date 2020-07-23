const {Router} = require('express');
const router = Router();
const auth = require('../middleware/auth');
const User = require('../models/user');


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
        user: req.user.toObject()
    });
});

router.post('/profile', auth, async (req, res) => {
    try {
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


module.exports = router;