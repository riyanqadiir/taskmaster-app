import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";

const ProtectedRoute = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                let token = localStorage.getItem("accessToken");
                if (!token) {
                    setIsAuthenticated(false);
                    setLoading(false);
                    return;
                }

                await api.get("/user/verify-token");
                setIsAuthenticated(true);
            } catch (error) {
                try {
                    const refreshResponse = await api.post("/user/refresh-token");

                    const newToken = refreshResponse.headers['authorization'];
                    if (newToken) {
                        localStorage.setItem("accessToken", newToken);
                        setIsAuthenticated(true);
                    } else {
                        setIsAuthenticated(false);
                    }
                } catch (err) {
                    setIsAuthenticated(false);
                }
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    if (loading) return <p>Loading...</p>;

    return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
