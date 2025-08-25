import React from 'react'
import { useState, createContext, useContext } from 'react'

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState();
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
