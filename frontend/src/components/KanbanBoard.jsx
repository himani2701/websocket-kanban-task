import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useSocket } from "../hooks/useSocket";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Plus, Layout, CheckCircle, Clock, ListTodo } from "lucide-react";
import TaskCard from "./TaskCard";

const COLUMNS = [
  { id: "To Do", icon: <ListTodo className="w-5 h-5" />, color: "bg-blue-500" },
  { id: "In Progress", icon: <Clock className="w-5 h-5" />, color: "bg-yellow-500" },
  { id: "Done", icon: <CheckCircle className="w-5 h-5" />, color: "bg-green-500" },
];

const COLORS = ["#3b82f6", "#f59e0b", "#10b981"];

export default function KanbanBoard() {
  const { tasks, createTask, moveTask, deleteTask, updateTask } = useSocket();
  const [newTaskTitle, setNewTaskTitle] = useState("");

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const { draggableId, destination } = result;
    moveTask(draggableId, destination.droppableId);
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    createTask({ title: newTaskTitle, status: "To Do", priority: "Medium", category: "Feature" });
    setNewTaskTitle("");
  };

  // Data for the Analytics Pie Chart
  const chartData = COLUMNS.map((col) => ({
    name: col.id,
    value: tasks.filter((t) => t.status === col.id).length,
  }));

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans">
      <header className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Layout className="text-blue-600" /> Real-Time Kanban
          </h1>
          <p className="text-gray-500">Manage your tasks and track progress instantly</p>
        </div>

        {/* Analytics Section */}
        <div className="w-full md:w-64 h-32 bg-white rounded-xl shadow-sm border border-gray-100 p-2">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={chartData} innerRadius={25} outerRadius={40} paddingAngle={5} dataKey="value">
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </header>

      {/* Task Input */}
      <form onSubmit={handleAddTask} className="max-w-7xl mx-auto mb-10 flex gap-2">
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="Enter new task title..."
          className="flex-1 px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
        />
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 font-medium transition-colors">
          <Plus size={20} /> Add Task
        </button>
      </form>

      {/* Kanban Grid */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {COLUMNS.map((column) => (
            <div key={column.id} className="bg-gray-100 rounded-xl p-4 min-h-[500px] flex flex-col">
              <div className="flex items-center gap-2 mb-4 px-2">
                <span className={`${column.color} p-1.5 rounded-lg text-white`}>{column.icon}</span>
                <h2 className="font-bold text-gray-700 uppercase tracking-wider">{column.id}</h2>
                <span className="ml-auto bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full text-xs font-bold">
                  {tasks.filter((t) => t.status === column.id).length}
                </span>
              </div>

              <Droppable droppableId={column.id}>
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef} className="flex-1 space-y-3">
                    {tasks
                      .filter((task) => task.status === column.id)
                      .map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided) => (
                            <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                              <TaskCard task={task} onUpdate={updateTask} onDelete={deleteTask} />
                            </div>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}