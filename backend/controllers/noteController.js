import Note from "../models/Note.js";
import Task from "../models/Task.js";

// Get all notes
export const getAllNotes = async (req, res) => {
    try {
        const { workspace, convertedToTask } = req.query;

        let filter = {};
        if (workspace) filter.workspace = workspace;
        if (convertedToTask !== undefined) filter.convertedToTask = convertedToTask === "true";

        const notes = await Note.find(filter)
            .populate("workspace", "name color")
            .populate("taskId", "title")
            .sort({ createdAt: -1 });

        res.json(notes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create note
export const createNote = async (req, res) => {
    try {
        const note = new Note(req.body);
        const savedNote = await note.save();

        const populatedNote = await Note.findById(savedNote._id)
            .populate("workspace", "name color");

        res.status(201).json(populatedNote);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete note
export const deleteNote = async (req, res) => {
    try {
        const note = await Note.findByIdAndDelete(req.params.id);

        if (!note) {
            return res.status(404).json({ message: "Note not found" });
        }

        res.json({ message: "Note deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Convert note to task
export const convertToTask = async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);

        if (!note) {
            return res.status(404).json({ message: "Note not found" });
        }

        if (note.convertedToTask) {
            return res.status(400).json({ message: "Note already converted to task" });
        }

        // Create task from note
        const task = new Task({
            title: note.content.substring(0, 100), // Use first 100 chars as title
            description: note.content,
            workspace: note.workspace,
        });

        const savedTask = await task.save();

        // Update note
        note.convertedToTask = true;
        note.taskId = savedTask._id;
        await note.save();

        const populatedTask = await Task.findById(savedTask._id)
            .populate("workspace", "name color");

        res.json({
            task: populatedTask,
            note: await Note.findById(note._id).populate("workspace", "name color"),
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
