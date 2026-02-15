import React, { useState, useMemo } from "react";
import { Plus } from "lucide-react";
import { DndContext, closestCorners, useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import TaskCard from "./TaskCard";

/**
 * DroppableColumn component creates a target zone for dnd-kit.
 */
function DroppableColumn({ id, tasks, onDeleteTask }) {
  const { setNodeRef } = useDroppable({ id });
  return (
    <div ref={setNodeRef} className="task-list" style={{ minHeight: "450px" }}>
      <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} onDelete={onDeleteTask} />
        ))}
      </SortableContext>
    </div>
  );
}

export default function KanbanBoard({ tasks, onAddTask, onDeleteTask, onDragEnd }) {
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [viewMode, setViewMode] = useState("status");

  const handleAddTask = (e) => {
    e.preventDefault();
    if (newTaskTitle.trim()) {
      onAddTask(newTaskTitle, priority);
      setNewTaskTitle("");
      setPriority("Medium");
    }
  };

  const columns = [
    { id: "todo", title: "TO DO", color: "#38bdf8" },
    { id: "in-progress", title: "IN PROGRESS", color: "#fbbf24" },
    { id: "done", title: "DONE", color: "#22c55e" },
  ];

  // Data memoization for Status view [cite: 2026-02-15]
  const statusData = useMemo(() => columns.map(col => ({
    name: col.title,
    value: (tasks || []).filter(t => t?.status === col.id).length || 0,
    color: col.color
  })), [tasks]);

  // Data memoization for Priority view [cite: 2026-02-15]
  const priorityData = useMemo(() => [
    { name: "High", value: (tasks || []).filter(t => t?.priority === "High").length || 0, color: "#ef4444" },
    { name: "Medium", value: (tasks || []).filter(t => t?.priority === "Medium" || !t?.priority).length || 0, color: "#fbbf24" },
    { name: "Low", value: (tasks || []).filter(t => t?.priority === "Low").length || 0, color: "#22c55e" },
  ], [tasks]);

  const activeData = viewMode === "status" ? statusData : priorityData;
  const hasData = activeData.some(d => d.value > 0);

  return (
    <div className="board-content">
      {/* Analytics Controls */}
      <div className="analytics-header">
        <h3 style={{ color: '#000000', margin: 0 }}>Analytics Dashboard</h3>
        <div className="toggle-group">
          <button 
            className={`toggle-btn ${viewMode === 'status' ? 'active' : ''}`}
            onClick={() => setViewMode('status')}
          >By Status</button>
          <button 
            className={`toggle-btn ${viewMode === 'priority' ? 'active' : ''}`}
            onClick={() => setViewMode('priority')}
          >By Priority</button>
        </div>
      </div>

      {/* Recharts Pie Chart [cite: 2026-02-15] */}
      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height="100%" debounce={100}>
          {hasData ? (
            <PieChart>
              <Pie
                data={activeData}
                cx="50%" cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                isAnimationActive={false}
              >
                {activeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                ))}
              </Pie>
              <Tooltip cursor={{ fill: 'transparent' }} />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          ) : null}
        </ResponsiveContainer>
      </div>

      {/* Task Creation Form */}
      <form onSubmit={handleAddTask} className="task-input-form">
        <input
          type="text"
          className="task-input"
          placeholder="What needs to be done?"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          style={{ color: '#000000' }}
        />
        <select 
          className="priority-select"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          style={{ color: '#000000' }}
        >
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
        <button type="submit" className="add-task-button">
          <Plus size={20} /> Add Task
        </button>
      </form>

      {/* Main Drag-and-Drop Area [cite: 2026-02-15] */}
      <DndContext collisionDetection={closestCorners} onDragEnd={onDragEnd}>
        <div className="kanban-grid">
          {columns.map((col) => (
            <div key={col.id} className="column">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h2 style={{ color: '#000000', fontSize: '1.1rem', margin: 0 }}>{col.title}</h2>
                <span className="task-count" style={{ color: col.color, fontWeight: '800' }}>
                  {(tasks || []).filter(t => t?.status === col.id).length}
                </span>
              </div>

              <DroppableColumn 
                id={col.id} 
                tasks={(tasks || []).filter(t => t?.status === col.id)} 
                onDeleteTask={onDeleteTask} 
              />
            </div>
          ))}
        </div>
      </DndContext>
    </div>
  );
}