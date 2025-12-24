import express from "express";
import {
    getAllWorkspaces,
    getWorkspaceById,
    createWorkspace,
    updateWorkspace,
    deleteWorkspace,
    setDefaultWorkspace,
} from "../controllers/workspaceController.js";

const router = express.Router();

// Workspace routes
router.get("/", getAllWorkspaces);
router.get("/:id", getWorkspaceById);
router.post("/", createWorkspace);
router.put("/:id", updateWorkspace);
router.delete("/:id", deleteWorkspace);
router.patch("/:id/default", setDefaultWorkspace);

export default router;
