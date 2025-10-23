import React, { useState, useEffect } from 'react';
import './App.css';
import AddTodo from './components/AddTodo.jsx';
import TodoList from './components/TodoList.jsx';
import CompletedTodos from './components/CompletedTodos.jsx';
import DeletedTodos from './components/DeletedTodos.jsx';

const API_BASE = "http://localhost:5000";

const VIEWS = {
    ACTIVE: 'active',
    COMPLETED: 'completed',
    DELETED: 'deleted',
};

function App() {
  const [todos, setTodos] = useState([]);
  const [updateTrigger, setUpdateTrigger] = useState(0); 
  const [currentView, setCurrentView] = useState(VIEWS.ACTIVE); 
  
  const [activeCount, setActiveCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [deletedCount, setDeletedCount] = useState(0);

  useEffect(() => {
    fetchTodos();
    fetchCounts();
  }, []);

  const fetchCounts = async () => {
    try {
      const activeRes = await fetch(API_BASE + "/todos");
      const activeData = await activeRes.json();
      setActiveCount(activeData.length);

      const completedRes = await fetch(API_BASE + "/todos/completed");
      const completedData = await completedRes.json();
      setCompletedCount(completedData.length);

      const deletedRes = await fetch(API_BASE + "/todos/deleted");
      const deletedData = await deletedRes.json();
      setDeletedCount(deletedData.length);
    } catch (err) {
      console.error("Error fetching counts: ", err);
    }
  };

  const fetchTodos = () => {
    fetch(API_BASE + "/todos")
      .then(res => res.json())
      .then(data => setTodos(data))
      .catch(err => console.error("Error fetching todos: ", err));

    setUpdateTrigger(prev => prev + 1); 
    fetchCounts();
  };

  const handleAdd = (newTodo) => {
    setTodos(prev => [...prev, newTodo]);
    setUpdateTrigger(prev => prev + 1); 
    fetchCounts();
  };
  
  return (
    
    <>
    <div id="heading1">Task Manager</div>
    <div className="App">
      <div className="todo-container">
        <header className="header-box">
          <p className="subtitle">Manage your task</p> 
          <div className="add-task-area">
            <AddTodo onAdd={handleAdd} />
          </div>
        </header>

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
            Completed ({completedCount})
          </button>
          <button 
            className={`tab-btn ${currentView === VIEWS.DELETED ? 'active' : ''}`}
            onClick={() => setCurrentView(VIEWS.DELETED)}
          >
            Deleted ({deletedCount})
          </button>
        </div>

        <div className="main-view">
          {currentView === VIEWS.ACTIVE && (
            <TodoList todos={todos} onUpdate={fetchTodos} />
          )}

          {currentView === VIEWS.COMPLETED && (
            <CompletedTodos key={`completed-${updateTrigger}`} onUpdate={fetchTodos} />
          )}

          {currentView === VIEWS.DELETED && (
            <DeletedTodos key={`deleted-${updateTrigger}`} onUpdate={fetchTodos} />
          )}
        </div>

      </div>
    </div>
    </>
  );
}

export default App;