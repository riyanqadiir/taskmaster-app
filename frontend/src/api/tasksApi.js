import api from "./axios";

export const fetchTasks = (params) =>
    api.get("/tasks", { params });

export const createTask = (payload) =>
    api.post("/tasks", payload);

export const updateTask = (id, payload) =>
    api.patch(`/tasks/${id}`, payload);

export const deleteTask = (id) =>
    api.delete(`/tasks/${id}`);
export const taskDetail = (id) => {
    api.get(`/tasks/detail/${id}`)
}