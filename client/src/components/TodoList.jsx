import React from 'react';

const API_BASE = "http://localhost:5000";

function TodoList({ todos, onUpdate }) {
  const completeTodo = async (id) => {
    try {
      await fetch(`${API_BASE}/todos/complete/${id}`, { method: 'PUT' });
      if (onUpdate) onUpdate();
    } catch (err) {
      console.error("Error completing todo:", err);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await fetch(`${API_BASE}/todos/delete/${id}`, { method: 'DELETE' });
      if (onUpdate) onUpdate();
    } catch (err) {
      console.error("Error deleting todo:", err);
    }
  };

  if (!todos || todos.length === 0) {
    return <h2>No tasks yet.</h2>;
  }

  return (
    <div>
      {todos.map(todo => (
        <div className={"todo" + (todo.completed ? " is-complete" : "")} key={todo._id}>
          <div
            className="checkbox"
            onClick={() => completeTodo(todo._id)}
            style={{ cursor: 'pointer' }}
          >
            {todo.completed ? "✔" : "⬜"}
          </div>
          <div className="text">{todo.text}</div>
          <div
            className="delete-todo"
            onClick={() => deleteTodo(todo._id)}
            style={{ cursor: 'pointer', color: 'red', marginLeft: '10px' }}
          >
            x
          </div>
        </div>
      ))}
    </div>
  );
}

export default TodoList;