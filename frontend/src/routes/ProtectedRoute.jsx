import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {verifyToken,verifyRefreshToken} from "../api/userApi";

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

                await verifyToken();
                setIsAuthenticated(true);
            } catch (error) {
                try {
                    const refreshResponse = await verifyRefreshToken();

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

    if (loading) {
        return <p>Loading...</p>;
    }

    return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
