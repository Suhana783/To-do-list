// server/server.js

// 1. Load environment variables (MUST be the first line to load .env data)
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Todo = require('./models/Todo');

const app = express();
const PORT = process.env.PORT || 5000;

// 2. Middleware setup
app.use(cors()); // Allows frontend (client) to access backend (server)
app.use(express.json()); // Allows server to read JSON data sent in requests (e.g., when creating a new Todo)


// ------------------------------------------------------------------
// Database Connection
// ------------------------------------------------------------------

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('MongoDB connected successfully!');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})
.catch(err => {
  console.error('MongoDB connection error:', err);
});


// ------------------------------------------------------------------
// CRUD API ROUTES
// ------------------------------------------------------------------

// 1. READ (GET All Todos) - Fetches the full list of tasks
app.get('/todos', async (req, res) => {
  try {
    const todos = await Todo.find({ deleted: false }).sort({ timestamp: -1 });
    res.json(todos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 2. READ (GET Completed Todos) - Fetches all completed tasks
app.get('/todos/completed', async (req, res) => {
  try {
    const todos = await Todo.find({ completed: true, deleted: false }).sort({ completedAt: -1 });
    res.json(todos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 3. READ (GET Deleted Todos) - Fetches all deleted tasks
app.get('/todos/deleted', async (req, res) => {
  try {
    const todos = await Todo.find({ deleted: true }).sort({ deletedAt: -1 });
    res.json(todos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 4. CREATE (POST a new Todo) - Adds a new task
app.post('/todos', async (req, res) => {
  try {
    const text = (req.body.text || '').trim();
    if (!text) return res.status(400).json({ message: 'Text is required' });

    const todo = new Todo({ text });
    await todo.save();
    res.status(201).json(todo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 5. UPDATE (PUT/Toggle a Todo's 'completed' status) - Marks a task as complete/incomplete
app.put('/todos/complete/:id', async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) return res.status(404).json({ message: 'Todo not found' });

    todo.completed = !todo.completed;
    todo.completedAt = todo.completed ? new Date() : null;
    await todo.save();
    res.json(todo);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 6. DELETE -> soft delete (mark deleted)
app.delete('/todos/delete/:id', async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) return res.status(404).json({ message: 'Todo not found' });

    todo.deleted = true;
    todo.deletedAt = new Date();
    await todo.save();
    res.json({ message: 'Todo marked deleted', todo });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});