import express from "express";
import {
    startFocusSession,
    endFocusSession,
    getFocusSessions,
    getFocusStats,
} from "../controllers/focusController.js";

const router = express.Router();

// Focus session routes
router.get("/", getFocusSessions);
router.get("/stats", getFocusStats);
router.post("/", startFocusSession);
router.patch("/:id/end", endFocusSession);

export default router;
