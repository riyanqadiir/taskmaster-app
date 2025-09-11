import api from "./axios";

export const fetchProfile = () => api.get("/user/profile");
export const updateProfile = (payload) => api.patch("/user/profile", payload);
export const changePassword = (payload) => api.patch("/user/change-password", payload);