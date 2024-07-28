const express = require("express"); // Web framework for Node.js
const http = require("http"); // Node.js module to create an HTTP server
const socketIo = require("socket.io"); // Library for real-time web socket communication
const { exec } = require("child_process"); // Executes shell commands from within Node.js
const fs = require("fs"); // File system module to read/write files
const cors = require("cors"); // Middleware to enable Cross-Origin Resource Sharing
const path = require("path"); // Utility module to work with file and directory paths

// Initializing Express app and creating an HTTP server
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Middleware setup
app.use(express.json()); // Parses JSON request bodies
app.use(cors()); // Enables CORS for all routes

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "client/dist")));

// Objects to manage users and chat history
const userSocketMap = {}; // Stores mapping of socket IDs to usernames
const roomChatHistory = {}; // Stores chat history for each room

// Helper function to get all connected clients in a room
function getAllConnectedClients(roomid) {
  const room = io.sockets.adapter.rooms.get(roomid);
  if (!room) return [];

  return Array.from(room).map((socketid) => ({
    socketid,
    username: userSocketMap[socketid],
  }));
}

// WebSocket event handling
io.on("connection", (socket) => {
  console.log("New client connected");

  // Handle client joining a room
  socket.on("join", ({ roomid, username }) => {
    if (!username) {
      socket.emit("redirect", "/");
      return;
    }
    userSocketMap[socket.id] = username; // Store username
    socket.join(roomid); // Join the room
    const clients = getAllConnectedClients(roomid);
    if (roomChatHistory[roomid]) {
      socket.emit("chat_history", roomChatHistory[roomid]); // Send chat history
    }
    clients.forEach(({ socketid }) => {
      io.to(socketid).emit("joined", {
        clients,
        username,
        socketid: socket.id,
      }); // Notify clients about the new user
    });
  });
  // Handle chat messages
  socket.on("message", ({ username, message, roomid, time, socketid }) => {
    const chatMessage = { username, message, time, socketid };
    if (!roomChatHistory[roomid]) {
      roomChatHistory[roomid] = [];
    }
    roomChatHistory[roomid].push(chatMessage); // Save chat message
    io.to(roomid).emit("message", chatMessage); // Send message to room
  });

  // Handle code synchronization
  socket.on("sync-change", ({ roomid, code }) => {
    io.to(roomid).emit("sync", code); // Sync code with all clients in the room
  });

  // Handle drawing on whiteboard
  socket.on("draw", (data) => {
    socket.to(data.roomid).emit("draw", data); // Broadcast drawing data
  });

  // Handle clearing the whiteboard
  socket.on("clear", (data) => {
    socket.to(data.roomid).emit("clear", data); // Broadcast clear data
  });

  // Handle client disconnecting
  socket.on("disconnecting", () => {
    const rooms = Array.from(socket.rooms);
    rooms.forEach((roomid) => {
      io.to(roomid).emit("disconnected", {
        socketId: socket.id,
        username: userSocketMap[socket.id],
      }); // Notify clients about the disconnection
    });
  });

  // Cleanup after client disconnects
  socket.on("disconnect", () => {
    delete userSocketMap[socket.id]; // Remove user from map
    console.log("Client disconnected");
  });
});





// Serve the React app for all remaining requests
app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, "client/dist", "index.html"));
});

// Define the port number
const port = 5000;

// Start the server
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});












