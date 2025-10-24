import React, { useEffect, useState } from 'react';

const API_BASE = "https://my-task-manager-api.onrender.com";

function CompletedTodos({ onUpdate }) {
  const [completedTodos, setCompletedTodos] = useState([]);

  useEffect(() => {
    fetchCompletedTodos();
  }, []);

  const fetchCompletedTodos = async () => {
    try {
      const res = await fetch(`${API_BASE}/todos/completed`);
      const data = await res.json();
      setCompletedTodos(data);
    } catch (err) {
      console.error("Error fetching completed todos:", err);
    }
  };
  
  const uncompleteTodo = async (id) => {
    try {
      await fetch(`${API_BASE}/todos/complete/${id}`, { method: 'PUT' });
      fetchCompletedTodos();
      if (onUpdate) onUpdate(); 
    } catch (err) {
      console.error("Error uncompleting todo:", err);
    }
  };
  
  const deleteTodo = async (id) => {
    try {
      await fetch(`${API_BASE}/todos/delete/${id}`, { method: 'DELETE' });
      fetchCompletedTodos();
      if (onUpdate) onUpdate(); 
    } catch (err) {
      console.error("Error deleting todo:", err);
    }
  };

  return (
    <div>
      {completedTodos.length === 0 ? (
        <p className="no-tasks-message">No completed tasks yet.</p>
      ) : (
        <ul>
          {completedTodos.map(todo => (
            <li className="list-item-with-actions" key={todo._id}>
                <span className="list-item-text">{todo.text}</span>
                <div className="list-item-actions">
                    <button 
                        className="action-btn uncomplete-btn"
                        onClick={() => uncompleteTodo(todo._id)}
                    >
                        🔄
                    </button>
                    <button 
                        className="action-btn delete-btn"
                        onClick={() => deleteTodo(todo._id)}
                    >
                        🗑️
                    </button>
                </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CompletedTodos;