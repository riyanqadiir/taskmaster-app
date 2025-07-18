import { Routes, Route } from 'react-router-dom';
import Login from '../components/authentication/Login';
import Signup from '../components/authentication/signup';
import OtpVerification from '../components/authentication/OtpVerification';
export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/verify-otp" element={<OtpVerification />} />
        </Routes>
    );
}
