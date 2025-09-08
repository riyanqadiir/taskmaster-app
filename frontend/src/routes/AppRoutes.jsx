import { Routes, Route, Navigate } from 'react-router-dom';
//Auth Routes
import Login from "../pages/authentication/Login";
import Signup from '../pages/authentication/Signup';
import OtpVerification from '../pages/authentication/OtpVerification';
import ForgotPassword from '../pages/authentication/ForgotPassword';
// layouts
import PublicLayout from "../components/layout/PublicLayout";
import ProtectedLayout from '../components/layout/ProtectedLayout';
// ProtectedRoute file
import ProtectedRoute from './ProtectedRoute';
//Protected Routes Pages:
import Dashboard from '../pages/dashboard';
import Tasks from '../pages/tasks';
import Profile from '../pages/Profile';
import TaskDetail from '../pages/TaskDetail';
export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/login" element={<PublicLayout ><Login /> </PublicLayout>} />
            <Route path="/signup" element={<PublicLayout ><Signup /> </PublicLayout>} />
            <Route path="/verify-otp" element={<PublicLayout ><OtpVerification /> </PublicLayout>} />
            <Route path="/forgot-password" element={<PublicLayout ><ForgotPassword /> </PublicLayout>} />

            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <ProtectedLayout >
                            <Dashboard />
                        </ProtectedLayout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/tasks"
                element={
                    <ProtectedRoute>
                        <ProtectedLayout >
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
            <Route
                path="/profile"
                element={
                    <ProtectedRoute>
                        <ProtectedLayout >
                            <Profile />
                        </ProtectedLayout>
                    </ProtectedRoute>
                }
            />


            <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
    );
}
