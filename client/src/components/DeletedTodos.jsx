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
  
  const clearAllDeleted = async () => {
    if (!window.confirm("Are you sure you want to permanently delete ALL archived tasks? This action cannot be undone.")) {
        return; 
    }
    try {
        await fetch(`${API_BASE}/todos/clear-deleted`, { method: 'DELETE' });
        
        fetchDeletedTodos();
        if (onUpdate) onUpdate();
    } catch (err) {
        console.error("Error clearing all deleted tasks:", err);
    }
  };

  return (
    <div>
      {deletedTodos.length === 0 ? (
        <p className="no-tasks-message">No deleted tasks.</p>
      ) : (
        <>
            <div className="list-actions-bar">
                <button 
                    className="clear-all-btn action-btn" 
                    onClick={clearAllDeleted}
                >
                    Clear All ({deletedTodos.length})
                </button>
            </div>
            <ul>
            {deletedTodos.map(todo => (
                <li className="list-item-with-actions deleted-item" key={todo._id}>
                    <span className="list-item-text">{todo.text}</span>
                    <div className="list-item-actions">
                        <button 
                            className="action-btn restore-btn"
                            onClick={() => restoreTodo(todo._id)}
                        >
                            ↩️
                        </button>
                    </div>
                </li>
            ))}
            </ul>
        </>
      )}
    </div>
  );
}

export default DeletedTodos;