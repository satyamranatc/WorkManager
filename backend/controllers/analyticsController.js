import Task from "../models/Task.js";
import Habit from "../models/Habit.js";
import FocusSession from "../models/FocusSession.js";

// Get progress timeline (completed tasks)
export const getProgressTimeline = async (req, res) => {
    try {
        const { workspace, days } = req.query;
        const daysCount = parseInt(days) || 30;

        const startDate = new Date();
        startDate.setDate(startDate.getDate() - daysCount);

        let filter = {
            completed: true,
            completedAt: { $gte: startDate },
        };

        if (workspace) filter.workspace = workspace;

        const tasks = await Task.find(filter)
            .populate("workspace", "name color")
            .populate("project", "name color")
            .sort({ completedAt: -1 });

        // Group by date
        const tasksByDate = {};
        tasks.forEach(task => {
            const date = task.completedAt.toISOString().split('T')[0];
            if (!tasksByDate[date]) {
                tasksByDate[date] = [];
            }
            tasksByDate[date].push(task);
        });

        res.json({
            tasks,
            tasksByDate,
            totalCompleted: tasks.length,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get achievements
export const getAchievements = async (req, res) => {
    try {
        const achievements = [];

        // Total tasks completed
        const totalTasks = await Task.countDocuments({ completed: true });
        if (totalTasks >= 1) achievements.push({ id: "first_task", name: "First Task", description: "Completed your first task", icon: "CheckCircle", unlocked: true });
        if (totalTasks >= 10) achievements.push({ id: "task_10", name: "Getting Started", description: "Completed 10 tasks", icon: "Target", unlocked: true });
        if (totalTasks >= 50) achievements.push({ id: "task_50", name: "Productive", description: "Completed 50 tasks", icon: "Zap", unlocked: true });
        if (totalTasks >= 100) achievements.push({ id: "task_100", name: "Centurion", description: "Completed 100 tasks", icon: "Award", unlocked: true });

        // Habit streaks
        const habits = await Habit.find();
        const maxStreak = Math.max(...habits.map(h => h.longestStreak), 0);

        if (maxStreak >= 7) achievements.push({ id: "streak_7", name: "Week Warrior", description: "7-day habit streak", icon: "Flame", unlocked: true });
        if (maxStreak >= 30) achievements.push({ id: "streak_30", name: "Monthly Master", description: "30-day habit streak", icon: "Trophy", unlocked: true });
        if (maxStreak >= 100) achievements.push({ id: "streak_100", name: "Unstoppable", description: "100-day habit streak", icon: "Crown", unlocked: true });

        // Focus time
        const focusSessions = await FocusSession.find({ completed: true });
        const totalFocusMinutes = focusSessions.reduce((sum, s) => sum + s.actualDuration, 0);
        const totalFocusHours = Math.round(totalFocusMinutes / 60);

        if (totalFocusHours >= 1) achievements.push({ id: "focus_1h", name: "Focused", description: "1 hour of focus time", icon: "Clock", unlocked: true });
        if (totalFocusHours >= 10) achievements.push({ id: "focus_10h", name: "Deep Worker", description: "10 hours of focus time", icon: "Brain", unlocked: true });
        if (totalFocusHours >= 50) achievements.push({ id: "focus_50h", name: "Flow State", description: "50 hours of focus time", icon: "Sparkles", unlocked: true });

        // Projects completed
        const completedProjects = await Task.distinct("project", { completed: true, project: { $ne: null } });
        if (completedProjects.length >= 1) achievements.push({ id: "project_1", name: "Project Complete", description: "Completed your first project", icon: "FolderCheck", unlocked: true });

        res.json({
            achievements,
            totalAchievements: achievements.length,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get overall statistics
export const getStats = async (req, res) => {
    try {
        const { workspace } = req.query;

        let filter = {};
        if (workspace) filter.workspace = workspace;

        // Tasks
        const totalTasks = await Task.countDocuments(filter);
        const completedTasks = await Task.countDocuments({ ...filter, completed: true });
        const activeTasks = await Task.countDocuments({ ...filter, completed: false });

        // Today's tasks
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const tasksCompletedToday = await Task.countDocuments({
            ...filter,
            completed: true,
            completedAt: { $gte: today, $lt: tomorrow },
        });

        // Habits
        const habits = await Habit.find(workspace ? { workspace } : {});
        const activeStreaks = habits.filter(h => h.currentStreak > 0).length;
        const maxStreak = Math.max(...habits.map(h => h.longestStreak), 0);

        // Focus time (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const recentSessions = await FocusSession.find({
            ...(workspace ? { workspace } : {}),
            completed: true,
            startTime: { $gte: sevenDaysAgo },
        });

        const focusMinutesThisWeek = recentSessions.reduce((sum, s) => sum + s.actualDuration, 0);

        res.json({
            tasks: {
                total: totalTasks,
                completed: completedTasks,
                active: activeTasks,
                completedToday: tasksCompletedToday,
            },
            habits: {
                total: habits.length,
                activeStreaks,
                maxStreak,
            },
            focus: {
                sessionsThisWeek: recentSessions.length,
                minutesThisWeek: focusMinutesThisWeek,
                hoursThisWeek: Math.round(focusMinutesThisWeek / 60 * 10) / 10,
            },
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
