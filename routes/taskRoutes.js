import express from "express";
import Task from "../models/Task.js"; // Ensure the .js extension
import User from "../models/User.js"; // Ensure the .js extension
import authMiddleware from "../middleware/authMiddleware.js"; // Ensure the .js extension

const router = express.Router();

// Create Task (Only Team Leader)
router.post("/", authMiddleware, async (req, res) => {
  if (req.user.role !== "team_leader") return res.status(403).json({ message: "Only Team Leaders can assign tasks" });

  const { title, description, assignedTo } = req.body;

  // Check if the assigned member belongs to the current Team Leader
  const teamMember = await User.findOne({ _id: assignedTo, teamLeader: req.user.id });
  if (!teamMember) return res.status(403).json({ message: "You can only assign tasks to your own team members" });

  const newTask = new Task({ title, description, assignedBy: req.user.id, assignedTo });
  await newTask.save();

  res.status(201).json(newTask);
});

// Get Tasks (For Team Leader & Members)
router.get("/", authMiddleware, async (req, res) => {
  let tasks;

  if (req.user.role === "team_leader") {
    // Only show tasks assigned by the logged-in team leader
    tasks = await Task.find({ assignedBy: req.user.id }).populate("assignedTo", "name");
  } else {
    // Only show tasks assigned to the logged-in team member
    tasks = await Task.find({ assignedTo: req.user.id });
  }

  res.json(tasks);
});

// Update Task Status (Only Members)
router.put("/:id", authMiddleware, async (req, res) => {
  if (req.user.role !== "team_member") return res.status(403).json({ message: "Only team members can update status" });

  const { status } = req.body;
  const task = await Task.findById(req.params.id);
  if (!task || task.assignedTo.toString() !== req.user.id) return res.status(403).json({ message: "Not authorized" });

  task.status = status;
  await task.save();

  res.json({ message: "Task status updated", task });
});

export default router;
