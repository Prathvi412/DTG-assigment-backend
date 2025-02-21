import Member from "../models/TeamMember.js";

// Controller to create a new team member
export const createMember = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if the member already exists
    const existingMember = await Member.findOne({ email });
    if (existingMember) {
      return res.status(400).json({ message: "Member already exists" });
    }

    // Create a new member
    const newMember = new Member({ name, email, password });
    await newMember.save();

    res.status(201).json({ message: "Team member added successfully", member: newMember });
  } catch (error) {
    res.status(500).json({ message: "Error adding member", error: error.message });
  }
};

// Controller to get all team members
export const getMembers = async (req, res) => {
  try {
    const members = await Member.find();
    res.status(200).json(members);
  } catch (error) {
    res.status(500).json({ message: "Error fetching members", error: error.message });
  }
};
