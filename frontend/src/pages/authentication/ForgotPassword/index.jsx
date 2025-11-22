import React, { useState, useRef } from "react";
import "../auth.css";
import ReCAPTCHA from "react-google-recaptcha";
import { forgotPassword } from "../../../api/userApi";
import { useNavigate } from "react-router-dom";
import { Form } from "react-bootstrap";

const ForgotPassword = () => {
    const [loading, setLoading] = useState(false);
    const [validated, setValidated] = useState(false);

    const navigate = useNavigate();
    const recaptchaRef = useRef();

    const [formData, setFormData] = useState({ email: "" });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e) => {
        setFormData({ email: e.target.value });
    };

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

            const response = await forgotPassword({ email: formData.email, token });

            if (response.status === 200 || response.status === 201) {
                setSuccess("Reset password link sent successfully!");
                setError("");

                setTimeout(() => navigate("/login"), 1500);
            }
        } catch (err) {
            setError(err.response?.data?.message || "Failed to send reset link");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <h1>Forgot Password</h1>

            <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Form.Group className="form-control">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        required
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        onChange={handleChange}
                        value={formData.email}
                        className="form-control"
                    />
                    <Form.Control.Feedback type="invalid">
                        Email is required
                    </Form.Control.Feedback>
                </Form.Group>

                {error && <p className="error">{error}</p>}
                {success && <p className="success">{success}</p>}

                <div className="recaptcha-container">
                    <ReCAPTCHA
                        sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                        size="invisible"
                        ref={recaptchaRef}
                    />
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? "Sending..." : "Submit"}
                </button>
            </Form>
        </div>
    );
};

export default ForgotPassword;
