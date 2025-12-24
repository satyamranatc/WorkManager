import express from "express";
import {
    getProgressTimeline,
    getAchievements,
    getStats,
} from "../controllers/analyticsController.js";

const router = express.Router();

// Analytics routes
router.get("/timeline", getProgressTimeline);
router.get("/achievements", getAchievements);
router.get("/stats", getStats);

export default router;
