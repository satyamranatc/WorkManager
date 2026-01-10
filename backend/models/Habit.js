import mongoose from "mongoose";

const completionSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true,
    },
    completed: {
        type: Boolean,
        default: true,
    },
});

const habitSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
            default: "",
        },
        frequency: {
            type: String,
            enum: ["daily", "weekly"],
            default: "daily",
        },
        color: {
            type: String,
            default: "#10b981", // green-500
        },
        currentStreak: {
            type: Number,
            default: 0,
        },
        longestStreak: {
            type: Number,
            default: 0,
        },
        completionHistory: [completionSchema],
        active: {
            type: Boolean,
            default: true,
        },
        workspace: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Workspace",
            default: null,
        },
        ownerId: {
            type: String,
            required: true,
            index: true,
        },
        layer: {
            type: String,
            enum: ["life", "growth"],
            default: "life",
        },
    },
    {
        timestamps: true,
    }
);

// Method to check if completed today
habitSchema.methods.isCompletedToday = function () {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return this.completionHistory.some(completion => {
        const completionDate = new Date(completion.date);
        completionDate.setHours(0, 0, 0, 0);
        return completionDate.getTime() === today.getTime() && completion.completed;
    });
};

// Method to check in habit for today
habitSchema.methods.checkIn = function () {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if already completed today
    const alreadyCompleted = this.isCompletedToday();
    if (alreadyCompleted) {
        return this;
    }

    // Add completion for today
    this.completionHistory.push({
        date: today,
        completed: true,
    });

    // Update streak
    this.currentStreak += 1;
    if (this.currentStreak > this.longestStreak) {
        this.longestStreak = this.currentStreak;
    }

    return this.save();
};

// Method to calculate streak (should be called periodically)
habitSchema.methods.updateStreak = function () {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const completedYesterday = this.completionHistory.some(completion => {
        const completionDate = new Date(completion.date);
        completionDate.setHours(0, 0, 0, 0);
        return completionDate.getTime() === yesterday.getTime() && completion.completed;
    });

    const completedToday = this.isCompletedToday();

    // If not completed today or yesterday, reset streak
    if (!completedToday && !completedYesterday) {
        this.currentStreak = 0;
    }

    return this.save();
};

const Habit = mongoose.model("Habit", habitSchema);

export default Habit;
