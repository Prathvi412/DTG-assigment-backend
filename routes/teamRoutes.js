import express from "express";
import { createMember, getMembers } from "../controllers/teamController.js";

const router = express.Router();

router.post("/create-member", createMember);
router.get("/members", getMembers);

export default router;
