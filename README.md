# 🚀 WorkManager

WorkManager is a premium, all-in-one productivity suite designed to help you organize your life, crush your goals, and maintain peak focus. Built with a modern MERN stack and a focus on visual excellence, it combines task management, project organization, habit tracking, and deep work tools into a single, seamless experience.

---

## ✨ Core Features

### 📊 Dashboard

Your productivity command center. Get a high-level overview of your day, including:

- **Daily Progress**: Real-time visualization of completed vs. pending tasks.
- **Project Status**: Quick links to your most active projects.
- **Recent Activity**: A stream of your latest updates and wins.

### 📝 Task Management

Advanced task handling that goes beyond a simple to-do list:

- **Priority Levels**: Categorize tasks as Low, Medium, or High.
- **Status Tracking**: Move tasks through lifecycle stages (Pending, In Progress, Review, Completed).
- **Workspace Integration**: Assign tasks to specific workspaces or projects.
- **Rich Metadata**: Add descriptions, due dates, and tags.

### 📂 Project & Workspace Organization

Structure your work the way you think:

- **Workspaces**: High-level containers for different areas of life (e.g., Work, Personal, Side Projects).
- **Projects**: Goal-oriented collections of tasks with internal progress tracking.
- **Easy Navigation**: Seamlessly switch between different context levels.

### 🔄 Habit Tracker

Build and maintain positive routines:

- **Daily Logging**: Track your consistency with simple check-ins.
- **Streaks**: Visualize your progress and stay motivated.
- **Customizable Habits**: Define habits with specific frequencies and categories.

### ⏱️ Focus Mode (Pomodoro)

A dedicated space for deep work:

- **Pomodoro Timer**: Pre-set intervals for intense focus and recovery.
- **Distraction-Free UI**: A minimalist interface designed to keep you in the zone.
- **Session History**: Track how many focus sessions you've completed.

### 📈 Progress & Analytics

Data-driven insights into your performance:

- **Performance Charts**: Visual representations of your task completion rates.
- **Habit Consistency**: Detailed breakdown of how well you're sticking to your routines.
- **Growth Tracking**: See your productivity improve over time.

### 💡 Quick Capture & Notes

Rapidly offload ideas before they disappear:

- **Instant Entry**: Fast-loading interface for quick brainstorming.
- **Rich Notes**: Store detailed information that doesn't necessarily fit into a task.

---

## 🎨 Design System

WorkManager features a **State-of-the-Art** user interface:

- **Glassmorphism**: Elegant, semi-transparent elements for a modern "Apple-style" aesthetic.
- **Smooth Animations**: Carefully crafted transitions and micro-interactions.
- **Responsive Layout**: Optimized for both desktop and mobile productivity.
- **Premium Typography**: Uses the "Inter" font family for maximum readability.

---

## 🛠️ Tech Stack

### Frontend

- **React (Vite)**: For a fast, reactive user interface.
- **Tailwind CSS**: Modern utility-first styling.
- **Lucide Icons**: Crisp, professional iconography.
- **React Router**: Seamless page transitions.

### Backend

- **Node.js & Express**: High-performance API server.
- **MongoDB & Mongoose**: Flexible, document-oriented database.
- **Dotenv**: Secure environment variable management.

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v16+)
- MongoDB (Running locally or Atlas)

### Setup Instructions

1. **Clone the Repository**

   ```bash
   git clone <repository-url>
   cd WorkManager
   ```

2. **Backend Setup**

   ```bash
   cd backend
   npm install
   # Create a .env file and add your MONGO_URI and PORT
   npm start
   ```

3. **Frontend Setup**

   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

4. **Access the App**
   Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🛣️ API Endpoints

- `/api/tasks` - Task CRUD operations
- `/api/projects` - Project management
- `/api/habits` - Habit tracking
- `/api/workspaces` - Workspace organization
- `/api/focus` - Pomodoro session logging
- `/api/analytics` - Productivity data
- `/api/notes` - Quick capture and long-form notes
