import React, { useEffect, useState } from 'react';

const API_BASE = "http://localhost:5000";

function DeletedTodos() {
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

  return (
    <div>
      <h3>Deleted Tasks</h3>
      {deletedTodos.length === 0 ? (
        <p>No deleted tasks.</p>
      ) : (
        <ul>
          {deletedTodos.map(todo => (
            <li key={todo._id}>{todo.text}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default DeletedTodos;