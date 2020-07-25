const {Router} = require('express');
const router = Router();
const Todo = require('../models/todo');
const auth = require('../middleware/auth');
const {validationResult} = require('express-validator');
const {todoValidators} = require('../utils/validators')


router.post('/', auth, todoValidators, async (req, res) => {
    const errors = validationResult(req);
    try {
        if (!errors.isEmpty()) {
            req.flash('error', 'Минимум 3 символа!')
            return res.status(422).redirect('/todo/');
        }
        const todoLength = await Todo.find();
        if (todoLength.length >= 100) {
            return res.render('limit', {
                title: 'Лимит исчерпан',
                isLimit: true
            });
        }

        const todo = new Todo({
            title: req.body.title,
            userId: req.user,
        });

        await todo.save();
        res.redirect('/todo/');
    } catch
        (e) {
        console.log(e);
    }
})
;


module.exports = router;