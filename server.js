import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import connectDB from "./config/db.js";  // Add .js extension for ES module imports
import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import projectroutes from "./routes/projectRoutes.js";
import teamRoutes  from "./routes/teamRoutes.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

connectDB();
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/project",projectroutes)

app.use("/api", teamRoutes);


// Socket.io for real-time updates
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("taskUpdated", (task) => {
    io.emit("updateTasks", task);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
