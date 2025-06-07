import React from "react"
import { Navigate } from "react-router-dom"
import { useAuth } from "./AuthProvider"

export const ProtectedRoute = ({ children }) => {
    const { currentUser } = useAuth();

    if (!currentUser || currentUser?.role != "admin") {
        return <Navigate to="/" replace />
    }

    return children
}

export const ProtectedRoute2 = ({ children }) => {
    const { currentUser } = useAuth();

    if (currentUser || currentUser?.role === "admin") {
        return <Navigate to="/dashboard" replace />
    }

    return children
}
