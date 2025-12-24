import mongoose from "mongoose";

const workspaceSchema = new mongoose.Schema(
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
        icon: {
            type: String,
            default: "Briefcase", // Lucide icon name
        },
        color: {
            type: String,
            default: "#8b5cf6", // violet-500
        },
        isDefault: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

// Ensure only one default workspace
workspaceSchema.pre("save", async function (next) {
    if (this.isDefault) {
        await mongoose.model("Workspace").updateMany(
            { _id: { $ne: this._id } },
            { isDefault: false }
        );
    }
    next();
});

const Workspace = mongoose.model("Workspace", workspaceSchema);

export default Workspace;
