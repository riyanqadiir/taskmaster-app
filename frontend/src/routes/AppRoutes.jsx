import { Routes, Route, Navigate } from 'react-router-dom';

// Auth Routes
import Login from "../pages/authentication/Login";
import Signup from '../pages/authentication/Signup';
import OtpVerification from '../pages/authentication/OtpVerification';
import ForgotPassword from '../pages/authentication/ForgotPassword';

// Layouts
import PublicLayout from "../components/layout/PublicLayout";
import ProtectedLayout from '../components/layout/ProtectedLayout';

// ProtectedRoute
import ProtectedRoute from './ProtectedRoute';

// Pages
import Dashboard from '../pages/Dashboard';
import Tasks from '../pages/Tasks';
import TaskDetail from '../pages/Tasks/TaskDetailPage'; 
import Profile from '../pages/Profile';

export default function AppRoutes() {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<PublicLayout><Login /></PublicLayout>} />
            <Route path="/signup" element={<PublicLayout><Signup /></PublicLayout>} />
            <Route path="/verify-otp" element={<PublicLayout><OtpVerification /></PublicLayout>} />
            <Route path="/forgot-password" element={<PublicLayout><ForgotPassword /></PublicLayout>} />

            {/* Protected Routes */}
            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <ProtectedLayout>
                            <Dashboard />
                        </ProtectedLayout>
                    </ProtectedRoute>
                }
            />

            {/* ✅ Tasks Routes (All, Deleted, Archive, Detail) */}
            <Route
                path="/tasks"
                element={
                    <ProtectedRoute>
                        <ProtectedLayout>
                            <Tasks />
                        </ProtectedLayout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/tasks/deleted"
                element={
                    <ProtectedRoute>
                        <ProtectedLayout>
                            <Tasks />
                        </ProtectedLayout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/tasks/archive"
                element={
                    <ProtectedRoute>
                        <ProtectedLayout>
                            <Tasks />
                        </ProtectedLayout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/tasks/:id"
                element={
                    <ProtectedRoute>
                        <ProtectedLayout>
                            <TaskDetail />
                        </ProtectedLayout>
                    </ProtectedRoute>
                }
            />

            {/* Profile */}
            <Route
                path="/profile"
                element={
                    <ProtectedRoute>
                        <ProtectedLayout>
                            <Profile />
                        </ProtectedLayout>
                    </ProtectedRoute>
                }
            />

            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
    );
}
