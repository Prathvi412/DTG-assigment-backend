import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ["team_leader", "team_member"], required: true },
  teamLeader: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Only for team members
});

const User = mongoose.model("User", UserSchema);
export default User;
