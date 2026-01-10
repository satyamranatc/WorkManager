import Habit from "../models/Habit.js";

// Get all habits
export const getAllHabits = async (req, res) => {
    try {
        const { workspace, active } = req.query;

        let filter = { ownerId: req.userId };
        if (workspace) filter.workspace = workspace;
        if (active !== undefined) filter.active = active === "true";

        const habits = await Habit.find(filter)
            .populate("workspace", "name color")
            .sort({ createdAt: -1 });

        res.json(habits);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get habit by ID
export const getHabitById = async (req, res) => {
    try {
        const habit = await Habit.findOne({ _id: req.params.id, ownerId: req.userId })
            .populate("workspace", "name color");

        if (!habit) {
            return res.status(404).json({ message: "Habit not found" });
        }

        res.json(habit);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create habit
export const createHabit = async (req, res) => {
    try {
        const habitData = { ...req.body, ownerId: req.userId };
        const habit = new Habit(habitData);
        const savedHabit = await habit.save();

        const populatedHabit = await Habit.findById(savedHabit._id)
            .populate("workspace", "name color");

        res.status(201).json(populatedHabit);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update habit
export const updateHabit = async (req, res) => {
    try {
        const habit = await Habit.findOneAndUpdate(
            { _id: req.params.id, ownerId: req.userId },
            req.body,
            { new: true, runValidators: true }
        ).populate("workspace", "name color");

        if (!habit) {
            return res.status(404).json({ message: "Habit not found" });
        }

        res.json(habit);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete habit
export const deleteHabit = async (req, res) => {
    try {
        const habit = await Habit.findOneAndDelete({ _id: req.params.id, ownerId: req.userId });

        if (!habit) {
            return res.status(404).json({ message: "Habit not found" });
        }

        res.json({ message: "Habit deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Check in habit for today
export const checkInHabit = async (req, res) => {
    try {
        const habit = await Habit.findOne({ _id: req.params.id, ownerId: req.userId });

        if (!habit) {
            return res.status(404).json({ message: "Habit not found" });
        }

        // Check if already completed today
        if (habit.isCompletedToday()) {
            return res.status(400).json({ message: "Habit already completed today" });
        }

        await habit.checkIn();

        const updatedHabit = await Habit.findById(habit._id)
            .populate("workspace", "name color");

        res.json(updatedHabit);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get habit statistics
export const getHabitStats = async (req, res) => {
    try {
        const habit = await Habit.findOne({ _id: req.params.id, ownerId: req.userId });

        if (!habit) {
            return res.status(404).json({ message: "Habit not found" });
        }

        const totalCompletions = habit.completionHistory.filter(c => c.completed).length;
        const completedToday = habit.isCompletedToday();

        // Calculate completion rate for last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const recentCompletions = habit.completionHistory.filter(c => {
            return c.completed && new Date(c.date) >= thirtyDaysAgo;
        }).length;

        const completionRate = Math.round((recentCompletions / 30) * 100);

        res.json({
            currentStreak: habit.currentStreak,
            longestStreak: habit.longestStreak,
            totalCompletions,
            completedToday,
            completionRate,
            recentHistory: habit.completionHistory.slice(-30),
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
