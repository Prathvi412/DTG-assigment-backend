import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    membersCount: {
      type: Number,
      required: true,
      min: 1, // Ensure at least 1 member
    },
    deadline: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Completed"],
      default: "Pending",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

// ✅ Exporting as ES Module
export default mongoose.model("Project", projectSchema);
