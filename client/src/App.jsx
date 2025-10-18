import React, { useState, useEffect } from 'react';
import './App.css';
import AddTodo from './components/AddTodo.jsx';
import TodoList from './components/TodoList.jsx';
import CompletedTodos from './components/CompletedTodos.jsx';
import DeletedTodos from './components/DeletedTodos.jsx';

const API_BASE = "http://localhost:5000";

function App() {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = () => {
    fetch(API_BASE + "/todos")
      .then(res => res.json())
      .then(data => setTodos(data))
      .catch(err => console.error("Error fetching todos: ", err));
  };

  const handleAdd = (newTodo) => {
    setTodos(prev => [...prev, newTodo]);
  };

  return (
    <div className="App">
      <h1>Your Tasks</h1>
      <AddTodo onAdd={handleAdd} />
      <TodoList todos={todos} onUpdate={fetchTodos} />
      <CompletedTodos />
      <DeletedTodos />
      <h2>Bye see you later</h2>
    </div>
  );
}

export default App;
