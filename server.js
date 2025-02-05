require("dotenv").config();
const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const socketIo = require("socket.io");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/auth");
const chatRoutes = require("./routes/chat");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: "*" } });

// Middleware
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(express.static("views"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

// Real-time Communication with Socket.io
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("joinRoom", (room) => {
    socket.join(room);
    console.log(`User joined room: ${room}`);
  });

  socket.on("chatMessage", (data) => {
    io.to(data.room).emit("message", data);
  });

  socket.on("typing", (data) => {
    socket.broadcast.to(data.room).emit("userTyping", data.username);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));