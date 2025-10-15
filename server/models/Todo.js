// server/models/Todo.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the structure of a single To-Do item
const TodoSchema = new Schema({
    text: {
        type: String,
        required: true // Must have text content
    },
    completed: {
        type: Boolean,
        default: false // Default state is incomplete
    },
    timestamp: {
        type: String,
        default: Date.now() // Records when the task was created
    }
});

// Create the Mongoose Model. MongoDB will store data in a collection named 'todos'.
const Todo = mongoose.model('Todo', TodoSchema);

module.exports = Todo;