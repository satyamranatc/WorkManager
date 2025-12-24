import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
    {
        content: {
            type: String,
            required: true,
            trim: true,
        },
        type: {
            type: String,
            enum: ["text", "idea", "reminder"],
            default: "text",
        },
        convertedToTask: {
            type: Boolean,
            default: false,
        },
        taskId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Task",
            default: null,
        },
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

const Note = mongoose.model("Note", noteSchema);

export default Note;
