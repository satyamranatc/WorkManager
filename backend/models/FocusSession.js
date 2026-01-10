import mongoose from "mongoose";

const focusSessionSchema = new mongoose.Schema(
    {
        task: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Task",
            default: null,
        },
        duration: {
            type: Number, // in minutes
            required: true,
            default: 25,
        },
        startTime: {
            type: Date,
            required: true,
        },
        endTime: {
            type: Date,
            default: null,
        },
        completed: {
            type: Boolean,
            default: false,
        },
        breakDuration: {
            type: Number, // in minutes
            default: 5,
        },
        actualDuration: {
            type: Number, // actual minutes worked
            default: 0,
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
            default: "growth",
        },
    },
    {
        timestamps: true,
    }
);

// Method to end session
focusSessionSchema.methods.endSession = function () {
    this.endTime = new Date();
    this.completed = true;

    // Calculate actual duration in minutes
    const durationMs = this.endTime - this.startTime;
    this.actualDuration = Math.round(durationMs / 60000);

    return this.save();
};

const FocusSession = mongoose.model("FocusSession", focusSessionSchema);

export default FocusSession;
