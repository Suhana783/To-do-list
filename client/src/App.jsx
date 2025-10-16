// client/src/App.jsx

import React, { useState, useEffect } from 'react';
import './App.css'; // Don't delete this, we'll use it for styles

const API_BASE = "http://localhost:5000"; // Define the base URL of your running backend

function App() {
  const [todos, setTodos] = useState([]); // State to hold the fetched To-Dos

  // useEffect runs once when the component loads
  useEffect(() => {
    GetTodos();
  }, []); // Empty array makes it run only on initial load

  // Function to fetch all To-Dos from your Node.js backend
  const GetTodos = () => {
    fetch(API_BASE + "/todos") // Calls your GET /todos route
      .then(res => res.json())
      .then(data => {
        console.log("Fetched Data:", data); // Check the console for data
        setTodos(data); // Store the fetched data in state
      })
      .catch(err => console.error("Error fetching todos: ", err));
  };
  
  // A simple function to render the Todo items
  const renderTodos = () => {
    if (!todos || todos.length === 0) {
      return <h2>No tasks yet.</h2>;
    }
    return todos.map(todo => (
      <div className={"todo" + (todo.completed ? " is-complete" : "")} key={todo._id}>
        <div className="checkbox"></div>
        <div className="text">{todo.text}</div>
        <div className="delete-todo">x</div>
      </div>
    ));
  };
  
  return (
    <div className="App">
      <h1>Welcome Ahana</h1>
      <h4>Your Tasks</h4>

      <div className="todos">
        {renderTodos()}
      </div>
    </div>
  );
}

export default App;
