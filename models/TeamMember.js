import mongoose from "mongoose";

const teamMemberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const TeamMember = mongoose.model("TeamMember", teamMemberSchema);
export default TeamMember;  // ✅ Correct ES Module export
