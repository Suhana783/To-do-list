// server/server.js

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Todo = require('./models/Todo');

const app = express();
const PORT = process.env.PORT || 5000;

// CRITICAL FIX: CORS Configuration for Netlify Deployment
const allowedOrigins = ['https://to-do-listsuhana783.netlify.app']; // Use your exact Netlify domain

const corsOptions = {
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        // or allow the specific Netlify domain
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'), false);
        }
    },
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    optionsSuccessStatus: 204
};

// 2. Middleware setup: APPLY the custom options
app.use(cors(corsOptions)); 
app.use(express.json()); 


mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log('MongoDB connected successfully!');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})
.catch(err => {
  console.error('MongoDB connection error:', err);
});


// 1. READ (GET All ACTIVE Todos)
app.get('/todos', async (req, res) => {
  try {
    const todos = await Todo.find({ deleted: false, completed: false }).sort({ timestamp: -1 });
    res.json(todos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 2. READ (GET Completed Todos)
app.get('/todos/completed', async (req, res) => {
  try {
    const todos = await Todo.find({ completed: true, deleted: false }).sort({ completedAt: -1 });
    res.json(todos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 3. READ (GET Deleted Todos)
app.get('/todos/deleted', async (req, res) => {
  try {
    const todos = await Todo.find({ deleted: true }).sort({ deletedAt: -1 });
    res.json(todos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 4. CREATE (POST a new Todo)
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

// 5. UPDATE (PUT/Toggle a Todo's 'completed' status)
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

// 6. DELETE (Soft Delete)
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

// 7. UPDATE (PUT/Restore a Todo)
app.put('/todos/restore/:id', async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) return res.status(404).json({ message: 'Todo not found' });

    todo.deleted = false;
    todo.deletedAt = null;
    await todo.save();
    res.json(todo);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 8. DELETE /todos/clear-deleted: Permanently remove all soft-deleted tasks
app.delete('/todos/clear-deleted', async (req, res) => {
  try {
    const result = await Todo.deleteMany({ deleted: true });
    res.json({ message: `${result.deletedCount} deleted tasks permanently removed.` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});