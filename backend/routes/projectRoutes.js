import express from "express";
import {
    getAllProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject,
    addTaskToProject,
    removeTaskFromProject,
} from "../controllers/projectController.js";

const router = express.Router();

// Project routes
router.get("/", getAllProjects);
router.get("/:id", getProjectById);
router.post("/", createProject);
router.put("/:id", updateProject);
router.delete("/:id", deleteProject);
router.post("/:id/tasks", addTaskToProject);
router.delete("/:id/tasks/:taskId", removeTaskFromProject);

export default router;
