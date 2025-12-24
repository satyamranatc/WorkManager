import mongoose from "mongoose";

const milestoneSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    completed: {
        type: Boolean,
        default: false,
    },
    dueDate: {
        type: Date,
        default: null,
    },
});

const projectSchema = new mongoose.Schema(
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
        status: {
            type: String,
            enum: ["planning", "active", "completed", "archived"],
            default: "planning",
        },
        color: {
            type: String,
            default: "#6366f1", // indigo-500
        },
        milestones: [milestoneSchema],
        workspace: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Workspace",
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

// Virtual to get tasks associated with this project
projectSchema.virtual("tasks", {
    ref: "Task",
    localField: "_id",
    foreignField: "project",
});

// Method to calculate progress
projectSchema.methods.calculateProgress = async function () {
    const Task = mongoose.model("Task");
    const tasks = await Task.find({ project: this._id });

    if (tasks.length === 0) return 0;

    const completedTasks = tasks.filter(task => task.completed).length;
    return Math.round((completedTasks / tasks.length) * 100);
};

const Project = mongoose.model("Project", projectSchema);

export default Project;
