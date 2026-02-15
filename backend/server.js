const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors()); 

const server = http.createServer(app);
const io = new Server(server, { 
  cors: { 
    origin: "http://localhost:3000", // Ensure this matches your Vite port
    methods: ["GET", "POST"]
  } 
});

// In-memory data store for tasks
let tasks = [];

io.on("connection", (socket) => {
  console.log(`🚀 Client Connected: ${socket.id}`);

  // Initial Sync: Send the current state and a null senderId to new clients
  socket.emit("tasks_updated", { updatedTasks: tasks, senderId: null });

  // Handle Bulk Updates (Add, Delete, Drag)
  socket.on("update_tasks", (data) => {
    // data structure: { updatedTasks, senderId }
    const { updatedTasks, senderId } = data;
    
    console.log(`📦 Received state update from ${senderId} (${updatedTasks.length} tasks)`);
    
    // Update the master in-memory list
    tasks = updatedTasks;
    
    /**
     * Use io.emit to send the update to EVERYONE.
     * The App.jsx on the sender's side will check the senderId and 
     * ignore the update to prevent the blinking render loop.
     */
    io.emit("tasks_updated", { updatedTasks: tasks, senderId });
  });

  socket.on("disconnect", () => {
    console.log(`❌ User disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`✅ WebSocket Server running on http://localhost:${PORT}`);
});