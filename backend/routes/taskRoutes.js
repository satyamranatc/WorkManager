import express from "express";
import {
    getAllTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskComplete,
    addSubtask,
    toggleSubtask,
    getTodayTasks,
    getUpcomingTasks,
} from "../controllers/taskController.js";

const router = express.Router();

// Task routes
router.get("/", getAllTasks);
router.get("/today", getTodayTasks);
router.get("/upcoming", getUpcomingTasks);
router.get("/:id", getTaskById);
router.post("/", createTask);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);
router.patch("/:id/toggle", toggleTaskComplete);
router.post("/:id/subtasks", addSubtask);
router.patch("/:id/subtasks/:subtaskId/toggle", toggleSubtask);

export default router;
