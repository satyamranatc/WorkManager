import mongoose from "mongoose";

const subtaskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    completed: {
        type: Boolean,
        default: false,
    },
});

const taskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
            default: "",
        },
        priority: {
            type: String,
            enum: ["low", "medium", "high"],
            default: "medium",
        },
        status: {
            type: String,
            enum: ["todo", "in-progress", "completed"],
            default: "todo",
        },
        dueDate: {
            type: Date,
            default: null,
        },
        tags: [{
            type: String,
            trim: true,
        }],
        workspace: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Workspace",
            default: null,
        },
        project: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project",
            default: null,
        },
        subtasks: [subtaskSchema],
        completed: {
            type: Boolean,
            default: false,
        },
        completedAt: {
            type: Date,
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

// Virtual for checking if task is overdue
taskSchema.virtual("isOverdue").get(function () {
    if (!this.dueDate || this.completed) return false;
    return new Date() > this.dueDate;
});

// Method to toggle completion
taskSchema.methods.toggleComplete = function () {
    this.completed = !this.completed;
    this.status = this.completed ? "completed" : "todo";
    this.completedAt = this.completed ? new Date() : null;
    return this.save();
};

const Task = mongoose.model("Task", taskSchema);

export default Task;
