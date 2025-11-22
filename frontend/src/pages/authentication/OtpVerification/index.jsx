import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyOtp } from "../../../api/userApi";
import ReCAPTCHA from "react-google-recaptcha";
import { Form, Button } from "react-bootstrap";
import api from "../../../api/axios";
import "../auth.css";

const OtpVerification = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const recaptchaRef = useRef();

    const [validated, setValidated] = useState(false);
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [resendMessage, setResendMessage] = useState("");
    const [isResending, setIsResending] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (location.state?.email) {
            setEmail(location.state.email);
        } else {
            setError("Email not found. Please sign up again.");
        }
    }, [location.state]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = e.currentTarget;

        if (!form.checkValidity()) {
            e.stopPropagation();
            setValidated(true);
            return;
        }

        if (loading) return;
        setLoading(true);

        try {
            const token = await recaptchaRef.current.executeAsync();
            recaptchaRef.current.reset();

            const response = await verifyOtp({ email, otp, token });

            if (response.status === 200 || response.status === 201) {
                setSuccess("OTP verified successfully!");
                setError("");

                setTimeout(() => navigate("/login"), 1500);
            }
        } catch (err) {
            setError(err?.response?.data?.message || "Invalid OTP");
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        setIsResending(true);
        setResendMessage("");

        try {
            const token = await recaptchaRef.current.executeAsync();
            recaptchaRef.current.reset();

            const res = await api.post("/user/resend-otp", {
                email,
                token
            });

            if (res.status === 200) {
                setResendMessage("OTP resent successfully.");
            }
        } catch (err) {
            setResendMessage("Failed to resend OTP.");
        }

        setIsResending(false);
    };

    return (
        <div className="auth-container">
            <h1>OTP Verification</h1>

            <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Form.Group className="form-control">
                    <Form.Label>Enter OTP</Form.Label>
                    <Form.Control
                        required
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="Enter OTP"
                        className="form-control"
                    />
                    <Form.Control.Feedback type="invalid">
                        OTP is required
                    </Form.Control.Feedback>
                </Form.Group>

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

                <button type="submit" disabled={loading}>
                    {loading ? "Verifying..." : "Verify OTP"}
                </button>

                <button
                    type="button"
                    className="resend-btn"
                    disabled={isResending}
                    onClick={handleResend}
                >
                    {isResending ? "Resending..." : "Resend OTP"}
                </button>
            </Form>
        </div>
    );
};

export default OtpVerification;
