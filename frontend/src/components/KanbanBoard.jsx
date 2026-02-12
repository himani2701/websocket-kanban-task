import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useSocket } from '../hooks/useSocket';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Plus } from 'lucide-react';
import TaskCard from './TaskCard';

const COLUMNS = ['To Do', 'In Progress', 'Done'];
const COLORS = ['#8884d8', '#00C49F', '#FFBB28'];

function KanbanBoard() {
    const { tasks, createTask, updateTask, moveTask, deleteTask } = useSocket();
    const [newTaskTitle, setNewTaskTitle] = useState('');

    // Handle Drag and Drop
    const onDragEnd = (result) => {
        const { destination, draggableId, source } = result;
        if (!destination) return;
        
        // Trigger update only if the column changed
        if (destination.droppableId !== source.droppableId) {
            moveTask(draggableId, destination.droppableId);
        }
    };

    const handleAddTask = () => {
        if (!newTaskTitle.trim()) return;
        createTask({
            title: newTaskTitle,
            description: '',
            status: 'To Do',
            priority: 'Medium',
            category: 'Feature',
            attachments: []
        });
        setNewTaskTitle('');
    };

    // Data for the Progress Graph
    const chartData = COLUMNS.map(col => ({
        name: col,
        value: tasks.filter(t => t.status === col).length
    }));

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800">Real-Time Kanban</h2>
                    <p className="text-gray-500 text-sm">Updates sync across all clients instantly</p>
                </div>
                
                {/* Task Stats Graph */}
                <div style={{ width: '200px', height: '120px' }}>
                    <ResponsiveContainer>
                        <PieChart>
                            <Pie 
                                data={chartData} 
                                innerRadius={30} 
                                outerRadius={45} 
                                paddingAngle={5} 
                                dataKey="value"
                                isAnimationActive={true}
                            >
                                {chartData.map((entry, index) => <Cell key={index} fill={COLORS[index]} />)}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Quick Add Task */}
            <div className="flex gap-2 mb-8 max-w-2xl">
                <input 
                    className="border p-2 rounded flex-1 shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    placeholder="Enter new task title..."
                    onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
                />
                <button 
                    onClick={handleAddTask} 
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2 transition-colors"
                >
                    <Plus size={18} /> Add Task
                </button>
            </div>

            <DragDropContext onDragEnd={onDragEnd}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {COLUMNS.map(column => (
                        <Droppable key={column} droppableId={column}>
                            {(provided) => (
                                <div 
                                    {...provided.droppableProps} 
                                    ref={provided.innerRef} 
                                    className="bg-gray-200/50 border border-gray-200 p-4 rounded-xl min-h-[600px]"
                                >
                                    <div className="flex justify-between items-center mb-4 px-1">
                                        <h3 className="font-bold uppercase text-xs text-gray-500 tracking-widest">{column}</h3>
                                        <span className="bg-gray-300 text-gray-600 text-[10px] px-2 py-0.5 rounded-full font-bold">
                                            {tasks.filter(t => t.status === column).length}
                                        </span>
                                    </div>

                                    {tasks.filter(t => t.status === column).map((task, index) => (
                                        <Draggable key={task.id} draggableId={task.id} index={index}>
                                            {(provided) => (
                                                <div 
                                                    ref={provided.innerRef} 
                                                    {...provided.draggableProps} 
                                                    {...provided.dragHandleProps}
                                                    className="mb-3"
                                                >
                                                    <TaskCard 
                                                        task={task} 
                                                        onUpdate={updateTask} 
                                                        onDelete={deleteTask} 
                                                    />
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    ))}
                </div>
            </DragDropContext>
        </div>
    );
}

export default KanbanBoard;