import { Routes, Route, Navigate } from 'react-router-dom';
import Login from "../components/authentication/Login";
import Signup from '../components/authentication/Signup';
import OtpVerification from '../components/authentication/OtpVerification';
import ForgotPassword from '../components/authentication/ForgotPassword';
import Dashboard from '../pages/Dashboard';
import ProtectedRoute from './ProtectedRoute';
import PublicLayout from "../components/layout/PublicLayout";
import ProtectedLayout from '../components/layout/ProtectedLayout';
import Tasks from '../pages/Tasks';
import Profile from '../pages/Profile';
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
