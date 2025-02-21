import Project from "../models/Project.js";

// Create a new project
export const createProject = async (req, res) => {
  try {
    console.log("Request body:", req.body);
    let { name, membersCount, deadline, status } = req.body;
   

    if (!name || !membersCount || !deadline) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Ensure membersCount is a number
    membersCount = Number(membersCount);
    if (isNaN(membersCount) || membersCount < 1) {
      return res.status(400).json({ message: "Invalid members count" });
    }

    const newProject = new Project({ name, membersCount, deadline, status });
    await newProject.save();

    res.status(201).json({ message: "Project created successfully", project: newProject });
  } catch (error) {
    console.error("Error creating project:", error);
    res.status(500).json({ message: "Error creating project", error: error.message });
  }
};


// Get all projects for the logged-in user
export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 }); // Fetch all projects sorted by createdAt (latest first)
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: "Error fetching projects", error: error.message });
  }
};

// Update project details
export const updateProject = async (req, res) => {
  try {
    const { name, membersCount, deadline, status } = req.body;
    const { id } = req.params;

    const updatedProject = await Project.findByIdAndUpdate(
      id,
      { name, membersCount, deadline, status },
      { new: true }
    );

    if (!updatedProject) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json({ message: "Project updated successfully", project: updatedProject });
  } catch (error) {
    res.status(500).json({ message: "Error updating project", error: error.message });
  }
};

// Delete a project
export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProject = await Project.findByIdAndDelete(id);

    if (!deletedProject) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting project", error: error.message });
  }
};
