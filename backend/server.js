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
  origin: ["http://localhost:5173", "https://workmanager-frontend.onrender.com"],
  credentials: true
}));
app.use(express.json());

// Simple request logger
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

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

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Global Error Handler:", err);
  
  // Handle Auth0 errors specifically
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ message: 'Invalid or missing token', error: err.message });
  }

  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
