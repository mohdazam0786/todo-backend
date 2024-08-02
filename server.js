require('dotenv').config(); // Load environment variables from .env file
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(cors()); // Enable CORS

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('Could not connect to MongoDB...', err));

// Define routes here

// Example route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

const todoSchema = new mongoose.Schema({
  title: String,
  completed: Boolean
});

const Todo = mongoose.model('Todo', todoSchema);

// Define routes
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Create a new todo
app.post('/api/todos', async (req, res) => {
  const todo = new Todo({
    title: req.body.title,
    completed: false
  });
  await todo.save();
  res.send(todo);
});

// Get all todos
app.get('/api/todos', async (req, res) => {
  const todos = await Todo.find();
  res.send(todos);
});

// Update a todo
app.put('/api/todos/:id', async (req, res) => {
  const todo = await Todo.findByIdAndUpdate(req.params.id, {
    title: req.body.title,
    completed: req.body.completed
  }, { new: true });

  if (!todo) return res.status(404).send('The todo with the given ID was not found.');

  res.send(todo);
});

// Delete a todo
app.delete('/api/todos/:id', async (req, res) => {
  try {
    const todo = await Todo.findByIdAndDelete(req.params.id);

    if (!todo) return res.status(404).send('The todo with the given ID was not found.');

    res.send(todo);
  } catch (error) {
    console.error('Error deleting todo:', error);
    res.status(500).send('Server error');
  }
});



// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
