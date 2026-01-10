import Workspace from "../models/Workspace.js";

// Get all workspaces
export const getAllWorkspaces = async (req, res) => {
    try {
        const workspaces = await Workspace.find({ ownerId: req.userId }).sort({ isDefault: -1, createdAt: 1 });
        res.json(workspaces);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get workspace by ID
export const getWorkspaceById = async (req, res) => {
    try {
        const workspace = await Workspace.findOne({ _id: req.params.id, ownerId: req.userId });

        if (!workspace) {
            return res.status(404).json({ message: "Workspace not found" });
        }

        res.json(workspace);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create workspace
export const createWorkspace = async (req, res) => {
    try {
        const workspaceData = { ...req.body, ownerId: req.userId };
        const workspace = new Workspace(workspaceData);
        const savedWorkspace = await workspace.save();

        res.status(201).json(savedWorkspace);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update workspace
export const updateWorkspace = async (req, res) => {
    try {
        const workspace = await Workspace.findOneAndUpdate(
            { _id: req.params.id, ownerId: req.userId },
            req.body,
            { new: true, runValidators: true }
        );

        if (!workspace) {
            return res.status(404).json({ message: "Workspace not found" });
        }

        res.json(workspace);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete workspace
export const deleteWorkspace = async (req, res) => {
    try {
        const workspace = await Workspace.findOne({ _id: req.params.id, ownerId: req.userId });

        if (!workspace) {
            return res.status(404).json({ message: "Workspace not found" });
        }

        if (workspace.isDefault) {
            return res.status(400).json({ message: "Cannot delete default workspace" });
        }

        await workspace.deleteOne();

        res.json({ message: "Workspace deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Set default workspace
export const setDefaultWorkspace = async (req, res) => {
    try {
        const workspace = await Workspace.findOne({ _id: req.params.id, ownerId: req.userId });

        if (!workspace) {
            return res.status(404).json({ message: "Workspace not found" });
        }

        workspace.isDefault = true;
        await workspace.save();

        res.json(workspace);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
