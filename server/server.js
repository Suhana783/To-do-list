// server/server.js

// 1. Load environment variables (MUST be the first line to load .env data)
require('dotenv').config(); 

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Import the To-Do Model (Schema) after the libraries it depends on
const Todo = require('./models/Todo'); 

const app = express();
const PORT = process.env.PORT || 5000;

// 2. Middleware setup
app.use(cors()); // Allows frontend (client) to access backend (server)
app.use(express.json()); // Allows server to read JSON data sent in requests (e.g., when creating a new Todo)


// ------------------------------------------------------------------
// Database Connection
// ------------------------------------------------------------------

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected successfully!');
    
    // Start the server only after the DB is connected
    app.listen(PORT, () => {
      console.log(`Server is running on port: ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });


// ------------------------------------------------------------------
// CRUD API ROUTES
// ------------------------------------------------------------------

// 1. READ (GET All Todos) - Fetches the full list of tasks
app.get('/todos', async (req, res) => {
    try {
        // Find all Todo items and sort by creation time
        const todos = await Todo.find().sort({ timestamp: 1 });
        res.json(todos);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 2. CREATE (POST a new Todo) - Adds a new task
app.post('/todos/new', async (req, res) => {
    try {
        // Create a new Todo item using the text sent from the frontend (req.body.text)
        const todo = new Todo({
            text: req.body.text 
        });
        await todo.save(); // Save the new item to MongoDB
        res.json(todo);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// 3. UPDATE (PUT/Toggle a Todo's 'completed' status) - Marks a task as complete/incomplete
app.put('/todos/complete/:id', async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);
        
        // Toggle the completed status (true becomes false, false becomes true)
        todo.completed = !todo.completed; 

        await todo.save(); // Save the updated status
        res.json(todo);
    } catch (err) {
        // If the ID isn't found
        res.status(404).json({ message: "Todo not found" });
    }
});

// 4. DELETE (DELETE a Todo) - Removes a task permanently
app.delete('/todos/delete/:id', async (req, res) => {
    try {
        // Find the Todo by its ID and remove it
        const result = await Todo.findOneAndDelete({ _id: req.params.id }); 
        
        if (result) {
            res.json({ message: 'Todo deleted successfully', deletedTodo: result });
        } else {
            res.status(404).json({ message: "Todo not found" });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});