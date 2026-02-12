import { useEffect, useState, useCallback } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5000';

export const useSocket = () => {
  const [socket, setSocket] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socketInstance = io(SOCKET_URL);
    setSocket(socketInstance);

    socketInstance.on('connect', () => setIsConnected(true));
    
    // Initial sync from server
    socketInstance.on('sync:tasks', (initialTasks) => {
      setTasks(initialTasks);
    });

    // Listen for real-time updates
    socketInstance.on('task:create', (task) => {
      setTasks((prev) => [...prev, task]);
    });

    socketInstance.on('task:update', (updatedTask) => {
      setTasks((prev) => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
    });

    socketInstance.on('task:move', ({ taskId, newStatus }) => {
      setTasks((prev) => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
    });

    socketInstance.on('task:delete', (taskId) => {
      setTasks((prev) => prev.filter(t => t.id !== taskId));
    });

    return () => socketInstance.disconnect();
  }, []);

  
  const createTask = useCallback((task) => socket?.emit('task:create', task), [socket]);
  const updateTask = useCallback((task) => socket?.emit('task:update', task), [socket]);
  const moveTask = useCallback((taskId, newStatus) => socket?.emit('task:move', { taskId, newStatus }), [socket]);
  const deleteTask = useCallback((taskId) => socket?.emit('task:delete', taskId), [socket]);

  return { tasks, isConnected, createTask, updateTask, moveTask, deleteTask };
};