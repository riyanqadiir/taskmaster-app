import api from "./axios";

export const fetchTasks = (params) =>
    api.get("/tasks", { params });
export const fetchDeletedTasks = (params) =>
    api.get(`/tasks/delete`, { params });
export const fetchArchiveTasks = (params) =>
    api.get(`/tasks/archive`, { params });
export const taskDetail = (id) =>
    api.get(`/tasks/detail/${id}`);
export const createTask = (payload) =>
    api.post("/tasks", payload);
export const archiveToggle = (id, payload) =>
    api.post(`/tasks/archive/${id}`, payload);
export const updateTask = (id, payload) =>
    api.patch(`/tasks/${id}`, payload);
export const deleteToggle = (id, payload) =>
    api.delete(`/tasks/${id}`, { data: payload });
export const hardDelete = (id) =>
    api.delete(`/tasks/hard-delete/${id}`);

export const updateDashboardLayout = (layout) =>
    api.put("/tasks/dashboard/layout", { layout });
