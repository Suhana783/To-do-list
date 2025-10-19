import React, { useState, useEffect } from 'react';
import './App.css';
import AddTodo from './components/AddTodo.jsx';
import TodoList from './components/TodoList.jsx';
import CompletedTodos from './components/CompletedTodos.jsx';
import DeletedTodos from './components/DeletedTodos.jsx';

const API_BASE = "http://localhost:5000";

// Define the views available for the tabs
const VIEWS = {
    ACTIVE: 'active',
    COMPLETED: 'completed',
    DELETED: 'deleted',
};

function App() {
  const [todos, setTodos] = useState([]);
  const [updateTrigger, setUpdateTrigger] = useState(0); 
  // NEW STATE: Manages which tab is currently visible
  const [currentView, setCurrentView] = useState(VIEWS.ACTIVE); 

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = () => {
    fetch(API_BASE + "/todos")
      .then(res => res.json())
      .then(data => setTodos(data))
      .catch(err => console.error("Error fetching todos: ", err));
    
    // Increment the trigger to force refresh of Completed/Deleted views
    setUpdateTrigger(prev => prev + 1); 
  };

  const handleAdd = (newTodo) => {
    setTodos(prev => [...prev, newTodo]);
    setUpdateTrigger(prev => prev + 1); 
  };
  
  // Calculate counts for the tabs
  const activeCount = todos.length;
  // NOTE: Completed/Deleted counts will require separate fetches or better state management,
  // but for now, we'll rely on the forced re-render mechanism for the other tabs.
  // We'll use a placeholder/separate logic for the count display in the final step.

  return (
    <div className="App">
      <div className="todo-container">
        
        {/* HEADER AREA */}
        <header className="header-box">
          <h1 className="main-title">My Tasks</h1>
          <p className="subtitle">Organize your daily tasks efficiently</p>
          <div className="add-task-area">
            <AddTodo onAdd={handleAdd} />
          </div>
        </header>

        {/* TAB NAVIGATION */}
        <div className="tab-navigation">
          <button 
            className={`tab-btn ${currentView === VIEWS.ACTIVE ? 'active' : ''}`}
            onClick={() => setCurrentView(VIEWS.ACTIVE)}
          >
            Active ({activeCount})
          </button>
          <button 
            className={`tab-btn ${currentView === VIEWS.COMPLETED ? 'active' : ''}`}
            onClick={() => setCurrentView(VIEWS.COMPLETED)}
          >
            Completed (0) {/* Placeholders - update these in a later step if you fetch counts */}
          </button>
          <button 
            className={`tab-btn ${currentView === VIEWS.DELETED ? 'active' : ''}`}
            onClick={() => setCurrentView(VIEWS.DELETED)}
          >
            Deleted (0) {/* Placeholders - update these in a later step if you fetch counts */}
          </button>
        </div>

        {/* MAIN VIEW AREA (Conditional Rendering) */}
        <div className="main-view">
          {currentView === VIEWS.ACTIVE && (
            <TodoList todos={todos} onUpdate={fetchTodos} />
          )}

          {currentView === VIEWS.COMPLETED && (
            <CompletedTodos key={`completed-${updateTrigger}`} />
          )}

          {currentView === VIEWS.DELETED && (
            <DeletedTodos key={`deleted-${updateTrigger}`} />
          )}
          
          {/* Your custom message removed for the clean UI */}
          {/* <h2>Bye see you later</h2> */}
        </div>

      </div>
    </div>
  );
}

export default App;