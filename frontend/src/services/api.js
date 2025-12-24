import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Tasks API
export const tasksAPI = {
    getAll: (params) => api.get("/tasks", { params }),
    getById: (id) => api.get(`/tasks/${id}`),
    getToday: () => api.get("/tasks/today"),
    getUpcoming: () => api.get("/tasks/upcoming"),
    create: (data) => api.post("/tasks", data),
    update: (id, data) => api.put(`/tasks/${id}`, data),
    delete: (id) => api.delete(`/tasks/${id}`),
    toggleComplete: (id) => api.patch(`/tasks/${id}/toggle`),
    addSubtask: (id, data) => api.post(`/tasks/${id}/subtasks`, data),
    toggleSubtask: (id, subtaskId) => api.patch(`/tasks/${id}/subtasks/${subtaskId}/toggle`),
};

// Projects API
export const projectsAPI = {
    getAll: (params) => api.get("/projects", { params }),
    getById: (id) => api.get(`/projects/${id}`),
    create: (data) => api.post("/projects", data),
    update: (id, data) => api.put(`/projects/${id}`, data),
    delete: (id) => api.delete(`/projects/${id}`),
    addTask: (id, taskId) => api.post(`/projects/${id}/tasks`, { taskId }),
    removeTask: (id, taskId) => api.delete(`/projects/${id}/tasks/${taskId}`),
};

// Habits API
export const habitsAPI = {
    getAll: (params) => api.get("/habits", { params }),
    getById: (id) => api.get(`/habits/${id}`),
    getStats: (id) => api.get(`/habits/${id}/stats`),
    create: (data) => api.post("/habits", data),
    update: (id, data) => api.put(`/habits/${id}`, data),
    delete: (id) => api.delete(`/habits/${id}`),
    checkIn: (id) => api.post(`/habits/${id}/checkin`),
};

// Notes API
export const notesAPI = {
    getAll: (params) => api.get("/notes", { params }),
    create: (data) => api.post("/notes", data),
    delete: (id) => api.delete(`/notes/${id}`),
    convertToTask: (id) => api.post(`/notes/${id}/convert`),
};

// Workspaces API
export const workspacesAPI = {
    getAll: () => api.get("/workspaces"),
    getById: (id) => api.get(`/workspaces/${id}`),
    create: (data) => api.post("/workspaces", data),
    update: (id, data) => api.put(`/workspaces/${id}`, data),
    delete: (id) => api.delete(`/workspaces/${id}`),
    setDefault: (id) => api.patch(`/workspaces/${id}/default`),
};

// Focus Sessions API
export const focusAPI = {
    getAll: (params) => api.get("/focus", { params }),
    getStats: (params) => api.get("/focus/stats", { params }),
    start: (data) => api.post("/focus", data),
    end: (id) => api.patch(`/focus/${id}/end`),
};

// Analytics API
export const analyticsAPI = {
    getTimeline: (params) => api.get("/analytics/timeline", { params }),
    getAchievements: () => api.get("/analytics/achievements"),
    getStats: (params) => api.get("/analytics/stats", { params }),
};

export default api;
