import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";  // Ensure the .js extension
import authMiddleware from "../middleware/authMiddleware.js"; // Ensure the .js extension

const router = express.Router();

// Team Leader Sign Up
router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ name, email, password: hashedPassword, role: "team_leader" });

  await newUser.save();
  res.status(201).json({ message: "Team Leader registered successfully" });
});

// Team Leader Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "User does not exist" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

  res.json({ token, role: user.role });
});

// Team Leader creates Team Member
router.post("/create-member", authMiddleware, async (req, res) => {
  if (req.user.role !== "team_leader") return res.status(403).json({ message: "Only Team Leaders can create members" });

  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const newMember = new User({
    name,
    email,
    password: hashedPassword,
    role: "team_member",
    teamLeader: req.user.id, // Link to Team Leader
  });

  await newMember.save();
  res.status(201).json({ message: "Team Member created successfully" });
});

// Get All Team Members (Only for Team Leader)
router.get("/team-members", authMiddleware, async (req, res) => {
  if (req.user.role !== "team_leader") return res.status(403).json({ message: "Only Team Leaders can view members" });

  const members = await User.find({ teamLeader: req.user.id }).select("-password");
  res.json(members);
});

export default router;
