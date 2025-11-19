import axios from "axios";

const api = axios.create({
    baseURL: "https://taskmaster-backend-production-65bd.up.railway.app",
    withCredentials: true, 
});
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
