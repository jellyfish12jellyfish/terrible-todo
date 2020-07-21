const {Router} = require('express');
const router = Router();
const Todo = require('../models/todo');
const User = require('../models/user');
const auth = require('../middleware/auth');

function isOwner(todo, req) {
    return todo.userId.toString() === req.user._id.toString();
}

router.get('/', auth, async (req, res) => {

    try {
        const todoLength = await Todo.find();

        const todo = await Todo.find().populate('userId')

        res.render('todo', {
            title: 'Todo',
            isTodo: true,
            userId: req.user ? req.user._id.toString() : null,
            todo,
            error: req.flash('addError')
        });
    } catch (e) {
        console.log(e);
    }
});

router.post('/delete', auth, async (req, res) => {
    try {
        await Todo.deleteOne({
            id: req.body._id,
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
            todo
        });
    } catch (e) {
        console.log(e);
    }
});

router.post('/edit', auth, async (req, res) => {
    const {id} = req.body;

    try {
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