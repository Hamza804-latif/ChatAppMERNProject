require("dotenv").config();
const express = require("express");
const cors = require("cors");
const database = require("./database/config.js");
const app = express();
const PORT = process.env.PORT || 5000;
const authRoutes = require("./routes/authRoutes.js");
const messagesRoutes = require("./routes/messagesRoutes.js");
const { Server } = require("socket.io");

let server;
global.onlineUsers = new Map();

const NodeServer = async () => {
  await database();
  app.use(cors());
  app.use(express.json());
  app.use("/api/auth", authRoutes);
  app.use("/api/messages", messagesRoutes);

  try {
    server = app.listen(8000, () => {
      console.log(`Server is live on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log("error on server running", error.message);
  }

  let io = new Server(server, {
    cors: true,
  });

  io.on("connection", (socket) => {
    global.chatSocket = socket;
    socket.on("add-user", (userId) => {
      onlineUsers.set(userId, socket.id);
    });
    socket.on("send-msg", (data) => {
      const sendUserSocket = onlineUsers.get(data.to);
      if (sendUserSocket) {
        socket.to(sendUserSocket).emit("message receive", data.msg);
      }
    });
  });
};

NodeServer();
