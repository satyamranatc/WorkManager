import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/dbConfig.js";
import taskRoutes from "./routes/taskRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import habitRoutes from "./routes/habitRoutes.js";
import noteRoutes from "./routes/noteRoutes.js";
import workspaceRoutes from "./routes/workspaceRoutes.js";
import focusRoutes from "./routes/focusRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import { requireAuth, attachUser } from "./middleware/authMiddleware.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(express.json());

connectDB();

// API Routes
// API Routes (Protected)
app.use("/api/tasks", requireAuth, attachUser, taskRoutes);
app.use("/api/projects", requireAuth, attachUser, projectRoutes);
app.use("/api/habits", requireAuth, attachUser, habitRoutes);
app.use("/api/notes", requireAuth, attachUser, noteRoutes);
app.use("/api/workspaces", requireAuth, attachUser, workspaceRoutes);
app.use("/api/focus", requireAuth, attachUser, focusRoutes);
app.use("/api/analytics", requireAuth, attachUser, analyticsRoutes);

app.get("/", (req, res) => {
  res.json({ message: "To-Do App API is live" });
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
