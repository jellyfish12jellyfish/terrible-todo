const {Router} = require('express');
const router = Router();
const Todo = require('../models/todo');
const auth = require('../middleware/auth');
const {validationResult} = require('express-validator');
const {todoValidators} = require('../utils/validators');

function isOwner(todo, req) {
    return todo.userId.toString() === req.user._id.toString();
}

router.get('/', auth, async (req, res) => {

    try {
        const todo = await Todo.find().populate('userId');
        let todoLength = todo.length;

        res.render('todo', {
            title: 'Todo',
            isTodo: true,
            userId: req.user ? req.user._id.toString() : null,
            todo,
            error: req.flash('addError'),
            todoLength
        });
    } catch (e) {
        console.log(e);
    }
});

router.post('/delete', auth, async (req, res) => {
    const {id} = req.body;
    try {
        await Todo.deleteOne({
            _id: id,
            userId: req.user._id
        });
        res.redirect('/todo');
    } catch (e) {
        console.log(e);
    }
});

router.get('/:id/edit', auth, async (req, res) => {
    if (!req.query.allow) {
        return res.redirect('/');
    }

    try {
        const todo = await Todo.findById(req.params.id).lean();

        if (!isOwner(todo, req)) {
            return res.redirect('/todo');
        }

        res.render('edit', {
            title: `Редактировать ${todo.title}`,
            todo,
            error: req.flash('error')
        });
    } catch (e) {
        console.log(e);
    }
});

router.post('/edit', todoValidators, auth, async (req, res) => {
    const {id} = req.body

    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            req.flash('error', 'Минимум  3 символа!');
            return res.status(422).redirect(`/todo/${id}/edit?allow=true`);
        }

        delete req.body.id;
        const todo = await Todo.findById(id);

        if (!isOwner(todo, req)) {
            return res.redirect('/todo');
        }

        Object.assign(todo, req.body);
        await todo.save();
        res.redirect('/todo');
    } catch (e) {
        console.log(e);
    }
});


module.exports = router;