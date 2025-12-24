import express from "express";
import {
    getAllNotes,
    createNote,
    deleteNote,
    convertToTask,
} from "../controllers/noteController.js";

const router = express.Router();

// Note routes
router.get("/", getAllNotes);
router.post("/", createNote);
router.delete("/:id", deleteNote);
router.post("/:id/convert", convertToTask);

export default router;
