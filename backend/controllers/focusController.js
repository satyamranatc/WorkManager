import FocusSession from "../models/FocusSession.js";

// Start focus session
export const startFocusSession = async (req, res) => {
    try {
        const { task, duration, workspace } = req.body;

        const session = new FocusSession({
            task,
            duration: duration || 25,
            startTime: new Date(),
            workspace,
            ownerId: req.userId,
            layer: req.body.layer || "growth",
        });

        const savedSession = await session.save();

        const populatedSession = await FocusSession.findById(savedSession._id)
            .populate("task", "title")
            .populate("workspace", "name color");

        res.status(201).json(populatedSession);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// End focus session
export const endFocusSession = async (req, res) => {
    try {
        const session = await FocusSession.findOne({ _id: req.params.id, ownerId: req.userId });

        if (!session) {
            return res.status(404).json({ message: "Focus session not found" });
        }

        if (session.completed) {
            return res.status(400).json({ message: "Session already completed" });
        }

        await session.endSession();

        const updatedSession = await FocusSession.findById(session._id)
            .populate("task", "title")
            .populate("workspace", "name color");

        res.json(updatedSession);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all focus sessions
export const getFocusSessions = async (req, res) => {
    try {
        const { workspace, startDate, endDate, limit } = req.query;

        let filter = { ownerId: req.userId };
        if (workspace) filter.workspace = workspace;

        if (startDate || endDate) {
            filter.startTime = {};
            if (startDate) filter.startTime.$gte = new Date(startDate);
            if (endDate) filter.startTime.$lte = new Date(endDate);
        }

        let query = FocusSession.find(filter)
            .populate("task", "title")
            .populate("workspace", "name color")
            .sort({ startTime: -1 });

        if (limit) {
            query = query.limit(parseInt(limit));
        }

        const sessions = await query;

        res.json(sessions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get focus statistics
export const getFocusStats = async (req, res) => {
    try {
        const { workspace, days } = req.query;
        const daysCount = parseInt(days) || 7;

        const startDate = new Date();
        startDate.setDate(startDate.getDate() - daysCount);

        let filter = {
            startTime: { $gte: startDate },
            completed: true,
            ownerId: req.userId,
        };

        if (workspace) filter.workspace = workspace;

        const sessions = await FocusSession.find(filter);

        const totalSessions = sessions.length;
        const totalMinutes = sessions.reduce((sum, session) => sum + session.actualDuration, 0);
        const averageSession = totalSessions > 0 ? Math.round(totalMinutes / totalSessions) : 0;

        // Group by date
        const sessionsByDate = {};
        sessions.forEach(session => {
            const date = session.startTime.toISOString().split('T')[0];
            if (!sessionsByDate[date]) {
                sessionsByDate[date] = {
                    count: 0,
                    minutes: 0,
                };
            }
            sessionsByDate[date].count += 1;
            sessionsByDate[date].minutes += session.actualDuration;
        });

        res.json({
            totalSessions,
            totalMinutes,
            totalHours: Math.round(totalMinutes / 60 * 10) / 10,
            averageSession,
            sessionsByDate,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
