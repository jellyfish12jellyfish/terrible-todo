const {Schema, model} = require('mongoose');

const todoSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    created: {
        type: Date, default: Date.now
    }
}, {timestamps: true});


todoSchema.method('toClient', function () {
    const todo = this.toObject();

    todo.id = todo._id;
    delete todo._id;

    return todo;
});

module.exports = model('Todo', todoSchema);