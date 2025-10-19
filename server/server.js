// client/src/components/CompletedTodos.jsx

import React, { useEffect, useState } from 'react';

const API_BASE = "http://localhost:5000";

function CompletedTodos() {
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

  return (
    <div>
      {/* REMOVED: <h3>Completed Tasks</h3> */} 
      {completedTodos.length === 0 ? (
        <p className="no-tasks-message">No completed tasks yet.</p>
      ) : (
        <ul>
          {completedTodos.map(todo => (
            <li key={todo._id}>{todo.text}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CompletedTodos;