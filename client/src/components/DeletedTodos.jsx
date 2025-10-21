import React, { useEffect, useState } from 'react';

const API_BASE = "http://localhost:5000";

function DeletedTodos({ onUpdate }) {
  const [deletedTodos, setDeletedTodos] = useState([]);

  useEffect(() => {
    fetchDeletedTodos();
  }, []);

  const fetchDeletedTodos = async () => {
    try {
      const res = await fetch(`${API_BASE}/todos/deleted`);
      const data = await res.json();
      setDeletedTodos(data);
    } catch (err) {
      console.error("Error fetching deleted todos:", err);
    }
  };
  
  const restoreTodo = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/todos/restore/${id}`, { method: 'PUT' }); 
      
      if (res.ok) {
          fetchDeletedTodos();
          if (onUpdate) onUpdate(); 
      }
    } catch (err) {
      console.error("Error restoring todo:", err);
    }
  };
  
  const hardDeleteTodo = async (id) => {
    try {
        console.log(`Attempted hard delete for ID: ${id}. Requires server endpoint.`);
    } catch (err) {
      console.error("Error permanently deleting todo:", err);
    }
  };

  return (
    <div>
      {deletedTodos.length === 0 ? (
        <p className="no-tasks-message">No deleted tasks.</p>
      ) : (
        <ul>
          {deletedTodos.map(todo => (
            <li className="list-item-with-actions" key={todo._id}>
                <span className="list-item-text">{todo.text}</span>
                <div className="list-item-actions">
                    <button 
                        className="action-btn restore-btn"
                        onClick={() => restoreTodo(todo._id)}
                    >
                        ↩️
                    </button>
                    <button 
                        className="action-btn hard-delete-btn"
                        onClick={() => hardDeleteTodo(todo._id)}
                    >
                        ❌
                    </button>
                </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default DeletedTodos;