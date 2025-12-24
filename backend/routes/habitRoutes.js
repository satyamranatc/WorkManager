import express from "express";
import {
    getAllHabits,
    getHabitById,
    createHabit,
    updateHabit,
    deleteHabit,
    checkInHabit,
    getHabitStats,
} from "../controllers/habitController.js";

const router = express.Router();

// Habit routes
router.get("/", getAllHabits);
router.get("/:id", getHabitById);
router.get("/:id/stats", getHabitStats);
router.post("/", createHabit);
router.put("/:id", updateHabit);
router.delete("/:id", deleteHabit);
router.post("/:id/checkin", checkInHabit);

export default router;
