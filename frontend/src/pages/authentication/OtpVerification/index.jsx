import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {verifyOtp} from "../../../api/userApi"
import api from '../../../api/axios';
import ReCAPTCHA from "react-google-recaptcha";
import "../auth.css";

const OtpVerification = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const recaptchaRef = useRef();
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [resendMessage, setResendMessage] = useState("");
    const [isResending, setIsResending] = useState(false);

    useEffect(() => {
        if (location.state?.email) {
            setEmail(location.state.email);
        } else {
            setError("Email not found. Please sign up again.");
        }
    }, [location.state]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!otp || !email) {
            setError("Please enter the OTP.");
            return;
        }

        try {
            const token = await recaptchaRef.current.executeAsync();
            recaptchaRef.current.reset();

            const response = await verifyOtp({
                email,
                otp,
                token
            });

            if (response.status === 200 || response.status === 201) {
                setSuccess("OTP verified successfully!");
                setError("");
                setTimeout(() => {
                    navigate("/login");
                }, 1500);
            }
        } catch (err) {
            console.log(err);
            setError(err?.response?.data?.message || "Invalid OTP or verification failed");
        }
    };

    const handleResendOtp = async () => {
        if (!email) {
            return;
        }

        setIsResending(true);
        setResendMessage("");
        try {
            const token = await recaptchaRef.current.executeAsync();
            recaptchaRef.current.reset();

            const response = await api.post("/user/resend-otp", {
                email,
                token
            });

            if (response.status === 200 || response.status === 201) {
                setResendMessage("OTP resent successfully. Please check your email.");
            }
        } catch (err) {
            console.log(err);
            setResendMessage("Failed to resend OTP. Try again later.");
        } finally {
            setIsResending(false);
        }
    };

    return (
        <div className="auth">
            <div className="auth-container">
                <h1>OTP Verification</h1>
                <form onSubmit={handleSubmit}>
                    <div className="form-control">
                        <label htmlFor="otp">Enter OTP</label>
                        <input
                            type="text"
                            id="otp"
                            name="otp"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            placeholder="Enter the OTP sent to your email"
                        />
                    </div>
                    {error && <p className="error">{error}</p>}
                    {success && <p className="success">{success}</p>}
                    {resendMessage && <p className="info">{resendMessage}</p>}

                    <div className="recaptcha-container">
                        <ReCAPTCHA
                            sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                            size="invisible"
                            ref={recaptchaRef}
                        />
                    </div>

                    <button type="submit">Verify OTP</button>
                    <button
                        type="button"
                        className="resend-btn"
                        onClick={handleResendOtp}
                        disabled={isResending}
                    >
                        {isResending ? "Resending..." : "Resend OTP"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default OtpVerification;
