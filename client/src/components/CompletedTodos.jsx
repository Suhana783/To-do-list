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
      <h3>Completed Tasks</h3>
      {completedTodos.length === 0 ? (
        <p>No completed tasks.</p>
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