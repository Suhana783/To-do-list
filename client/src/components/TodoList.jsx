import React from 'react';

const API_BASE = "https://my-task-manager-api.onrender.com";

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
    return <p className="no-tasks-message">No active tasks. Add one to get started!</p>;
  }

  return (
    <div>
      {todos.map(todo => (
        <div className={"todo" + (todo.completed ? " is-complete" : "")} key={todo._id}>
          
          <div className="checkbox-and-text">
            <div
              className="checkbox"
              onClick={() => completeTodo(todo._id)}
              style={{ cursor: 'pointer' }}
            >
              ✔
            </div>
            <div className="text">{todo.text}</div>
          </div>
          
          <div
            className="delete-todo"
            onClick={() => deleteTodo(todo._id)}
            style={{ cursor: 'pointer' }}
          >
            🗑️
          </div>
        </div>
      ))}
    </div>
  );
}

export default TodoList;