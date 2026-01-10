import Task from "../models/Task.js";

// Get all tasks with filters
export const getAllTasks = async (req, res) => {
    try {
        const { workspace, status, priority, tags, startDate, endDate } = req.query;

        let filter = { ownerId: req.userId };

        if (workspace) filter.workspace = workspace;
        if (status) filter.status = status;
        if (priority) filter.priority = priority;
        if (tags) filter.tags = { $in: tags.split(",") };

        if (startDate || endDate) {
            filter.dueDate = {};
            if (startDate) filter.dueDate.$gte = new Date(startDate);
            if (endDate) filter.dueDate.$lte = new Date(endDate);
        }

        const tasks = await Task.find(filter)
            .populate("workspace", "name color")
            .populate("project", "name color")
            .sort({ createdAt: -1 });

        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get task by ID
export const getTaskById = async (req, res) => {
    try {
        const task = await Task.findOne({ _id: req.params.id, ownerId: req.userId })
            .populate("workspace", "name color")
            .populate("project", "name color");

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        res.json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create task
export const createTask = async (req, res) => {
    try {
        const taskData = { ...req.body, ownerId: req.userId };
        const task = new Task(taskData);
        const savedTask = await task.save();

        const populatedTask = await Task.findById(savedTask._id)
            .populate("workspace", "name color")
            .populate("project", "name color");

        res.status(201).json(populatedTask);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update task
export const updateTask = async (req, res) => {
    try {
        const task = await Task.findOneAndUpdate(
            { _id: req.params.id, ownerId: req.userId },
            req.body,
            { new: true, runValidators: true }
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

// Delete task
export const deleteTask = async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, ownerId: req.userId });

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        res.json({ message: "Task deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Toggle task completion
export const toggleTaskComplete = async (req, res) => {
    try {
        const task = await Task.findOne({ _id: req.params.id, ownerId: req.userId });

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        await task.toggleComplete();

        const updatedTask = await Task.findOne({ _id: task._id, ownerId: req.userId })
            .populate("workspace", "name color")
            .populate("project", "name color");

        res.json(updatedTask);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Add subtask
export const addSubtask = async (req, res) => {
    try {
        const task = await Task.findOne({ _id: req.params.id, ownerId: req.userId });

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        task.subtasks.push(req.body);
        await task.save();

        const updatedTask = await Task.findById(task._id)
            .populate("workspace", "name color")
            .populate("project", "name color");

        res.json(updatedTask);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Toggle subtask completion
export const toggleSubtask = async (req, res) => {
    try {
        const task = await Task.findOne({ _id: req.params.id, ownerId: req.userId });

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        const subtask = task.subtasks.id(req.params.subtaskId);
        if (!subtask) {
            return res.status(404).json({ message: "Subtask not found" });
        }

        subtask.completed = !subtask.completed;
        await task.save();

        const updatedTask = await Task.findById(task._id)
            .populate("workspace", "name color")
            .populate("project", "name color");

        res.json(updatedTask);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get today's tasks
export const getTodayTasks = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const tasks = await Task.find({
            dueDate: { $gte: today, $lt: tomorrow },
            completed: false,
            ownerId: req.userId,
        })
            .populate("workspace", "name color")
            .populate("project", "name color")
            .sort({ priority: -1 });

        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get upcoming tasks
export const getUpcomingTasks = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const nextWeek = new Date(today);
        nextWeek.setDate(nextWeek.getDate() + 7);

        const tasks = await Task.find({
            dueDate: { $gte: today, $lte: nextWeek },
            completed: false,
            ownerId: req.userId,
        })
            .populate("workspace", "name color")
            .populate("project", "name color")
            .sort({ dueDate: 1 });

        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
