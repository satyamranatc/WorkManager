import Project from "../models/Project.js";
import Task from "../models/Task.js";

// Get all projects
export const getAllProjects = async (req, res) => {
    try {
        const { workspace, status } = req.query;

        let filter = { ownerId: req.userId };
        if (workspace) filter.workspace = workspace;
        if (status) filter.status = status;

        const projects = await Project.find(filter)
            .populate("workspace", "name color")
            .sort({ createdAt: -1 });

        // Get task counts for each project
        const projectsWithCounts = await Promise.all(
            projects.map(async (project) => {
                const taskCount = await Task.countDocuments({ project: project._id, ownerId: req.userId });
                const completedCount = await Task.countDocuments({
                    project: project._id,
                    completed: true,
                    ownerId: req.userId
                });
                const progress = taskCount > 0 ? Math.round((completedCount / taskCount) * 100) : 0;

                return {
                    ...project.toObject(),
                    taskCount,
                    completedCount,
                    progress,
                };
            })
        );

        res.json(projectsWithCounts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get project by ID
export const getProjectById = async (req, res) => {
    try {
        const project = await Project.findOne({ _id: req.params.id, ownerId: req.userId })
            .populate("workspace", "name color");

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        const tasks = await Task.find({ project: project._id, ownerId: req.userId })
            .populate("workspace", "name color");

        const progress = await project.calculateProgress();

        res.json({
            ...project.toObject(),
            tasks,
            progress,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create project
export const createProject = async (req, res) => {
    try {
        const projectData = { ...req.body, ownerId: req.userId };
        const project = new Project(projectData);
        const savedProject = await project.save();

        const populatedProject = await Project.findById(savedProject._id)
            .populate("workspace", "name color");

        res.status(201).json(populatedProject);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update project
export const updateProject = async (req, res) => {
    try {
        const project = await Project.findOneAndUpdate(
            { _id: req.params.id, ownerId: req.userId },
            req.body,
            { new: true, runValidators: true }
        ).populate("workspace", "name color");

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        res.json(project);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete project
export const deleteProject = async (req, res) => {
    try {
        const project = await Project.findOneAndDelete({ _id: req.params.id, ownerId: req.userId });

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        // Optionally remove project reference from tasks
        await Task.updateMany(
            { project: req.params.id, ownerId: req.userId },
            { $unset: { project: "" } }
        );

        res.json({ message: "Project deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Add task to project
export const addTaskToProject = async (req, res) => {
    try {
        const { taskId } = req.body;

        const task = await Task.findOneAndUpdate(
            { _id: taskId, ownerId: req.userId },
            { project: req.params.id },
            { new: true }
        )
            .populate("workspace", "name color")
            .populate("project", "name color");

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        res.json(task);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Remove task from project
export const removeTaskFromProject = async (req, res) => {
    try {
        const task = await Task.findOneAndUpdate(
            { _id: req.params.taskId, ownerId: req.userId },
            { $unset: { project: "" } },
            { new: true }
        )
            .populate("workspace", "name color");

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        res.json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
