const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { 
  cors: { origin: "*" } 
});

// In-memory data store for tasks
// Structure: { id, title, description, status, priority, category, attachments }
let tasks = [];

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  // 1. Sync: Send all existing tasks to the newly connected client
  socket.emit("sync:tasks", tasks);

  // 2. Task:Create
  socket.on("task:create", (newTask) => {
    const task = { ...newTask, id: Date.now().toString(), createdAt: new Date() };
    tasks.push(task);
    io.emit("task:create", task); // Broadcast to all clients
  });

  // 3. Task:Update (title, description, priority, category, attachments)
  socket.on("task:update", (updatedTask) => {
    tasks = tasks.map((t) => (t.id === updatedTask.id ? { ...t, ...updatedTask } : t));
    io.emit("task:update", updatedTask);
  });

  // 4. Task:Move (Moving between columns)
  socket.on("task:move", ({ taskId, newStatus }) => {
    tasks = tasks.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t));
    io.emit("task:move", { taskId, newStatus });
  });

  // 5. Task:Delete
  socket.on("task:delete", (taskId) => {
    tasks = tasks.filter((t) => t.id !== taskId);
    io.emit("task:delete", taskId);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
