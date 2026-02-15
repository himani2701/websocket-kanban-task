import React, { useState, useEffect, useMemo } from "react";
import { arrayMove } from "@dnd-kit/sortable";
import { io } from "socket.io-client";
import "./App.css";
import KanbanBoard from "./components/KanbanBoard";

// Establish connection to the Node.js backend
const socket = io("http://localhost:5000");

function App() {
  const [tasks, setTasks] = useState([]);

  // 1. Generate a persistent Unique ID for this session
  // This is used for "Echo-Filtering" to stop the board from blinking [cite: 2026-02-15].
  const clientId = useMemo(() => Math.random().toString(36).substr(2, 9), []);

  // 2. WebSocket Listener
  useEffect(() => {
    socket.on("tasks_updated", (data) => {
      // Logic: Ignore updates that I sent myself to prevent render loops [cite: 2026-02-15].
      if (data.senderId !== clientId) {
        setTasks(data.updatedTasks);
      }
    });

    return () => socket.off("tasks_updated");
  }, [clientId]);

  // 3. Persistent Storage (Browser Level)
  useEffect(() => {
    const savedTasks = localStorage.getItem("syncboard-tasks");
    if (savedTasks) {
      try {
        setTasks(JSON.parse(savedTasks));
      } catch (e) {
        console.error("Local storage sync failed", e);
      }
    }
  }, []);

  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem("syncboard-tasks", JSON.stringify(tasks));
    }
  }, [tasks]);

  // 4. Manual Sync Helper
  // Broadcasts changes with the senderId included [cite: 2026-02-15].
  const updateAndSync = (newTasks) => {
    setTasks(newTasks);
    socket.emit("update_tasks", { 
      updatedTasks: newTasks, 
      senderId: clientId 
    });
  };

  // 5. CRUD Handlers
  const handleAddTask = (title, priority = "Medium") => {
    const newTask = { 
      id: Date.now().toString(), 
      title, 
      status: "todo",
      priority, 
      category: "Internal" 
    };
    updateAndSync([...tasks, newTask]);
  };

  const handleDeleteTask = (id) => {
    updateAndSync(tasks.filter((task) => task.id !== id));
  };

  // 6. Drag and Drop Logic
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    const oldIndex = tasks.findIndex((t) => t.id === activeId);
    const activeTask = tasks[oldIndex];
    let newTasks = [...tasks];

    // Check if task was dropped on a column header or an empty column
    const isColumn = ['todo', 'in-progress', 'done'].includes(overId);
    if (isColumn) {
      if (activeTask.status !== overId) {
        newTasks[oldIndex] = { ...activeTask, status: overId };
        updateAndSync(newTasks);
      }
      return;
    }

    // Handle reordering within or across columns
    const newIndex = tasks.findIndex((t) => t.id === overId);
    const overTask = tasks[newIndex];

    if (activeTask.status !== overTask.status) {
      newTasks[oldIndex] = { ...activeTask, status: overTask.status };
      newTasks = arrayMove(newTasks, oldIndex, newIndex);
    } else {
      newTasks = arrayMove(newTasks, oldIndex, newIndex);
    }

    updateAndSync(newTasks);
  };

  return (
    <div className="app-main">
      <header className="hero-section">
        <div className="connection-status">
          <span className="dot"></span> Real-time Sync Active
        </div>
        <h1 className="hero-title">SyncBoard</h1>
        <p className="hero-subtitle">Real-time collaboration, zero friction.</p>
        
      </header>

      <div className="board-container">
        <KanbanBoard 
          tasks={tasks} 
          onAddTask={handleAddTask} 
          onDeleteTask={handleDeleteTask} 
          onDragEnd={handleDragEnd}
        />
      </div>

      <footer style={{ 
        textAlign: 'center', 
        padding: '20px', 
        color: '#94a3b8', 
        fontSize: '12px',
        marginTop: 'auto' 
      }}>
        Developed  by himani2701
      </footer>
    </div>
  );
}

export default App;