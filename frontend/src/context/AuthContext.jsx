import React from 'react'
import { useState, createContext, useContext,useEffect } from 'react'
import api from '../api/axios';
const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState();
    useEffect(() => {
        const token = localStorage.getItem("accessToken"); // or cookie
        if (!token) return;

        const fetchUser = async () => {
            try {
                const { data } = await api.get("/user/me");
                setUser(data.user);
            } catch (err) {
                console.error(err);
                setUser(null);
            }
        };

        fetchUser();
    }, []);
    return (
        <>
            <AuthContext.Provider value={{ user, setUser }}>
                {children}
            </AuthContext.Provider>
        </>
    )
}
export function useAuth() {
    return useContext(AuthContext);
}
