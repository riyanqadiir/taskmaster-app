import api from "./axios";

export const login = (payload) =>
    api.post("/user/login", payload);

export const signup = (payload) =>
    api.post("/user/signup", payload);

export const forgotPassword = (payload) =>
    api.post("/user/forgot-password", payload);
export const verifyOtp = (payload) =>
    api.post("/user/verify-otp", payload);
export const verifyToken = () =>
    api.get("/user/verify-token");
export const verifyRefreshToken = () =>
    api.post("/user/refresh-token");
export const me = () =>
    api.get("/user/me");
