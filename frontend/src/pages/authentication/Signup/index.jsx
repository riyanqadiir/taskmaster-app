import React, { useState, useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { signup } from "../../../api/userApi";
import { useNavigate, Link } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import "../auth.css";

const Signup = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [validated, setValidated] = useState(false);

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const recaptchaRef = useRef();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        if (!form.checkValidity()) {
            e.stopPropagation();
            setValidated(true);
            return;
        }

        const { password, confirmPassword } = formData;

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (loading) return;
        setLoading(true);
        setValidated(true);

        try {
            const token = await recaptchaRef.current.executeAsync();
            recaptchaRef.current.reset();

            const response = await signup({ ...formData, token });

            if (response.status === 200 || response.status === 201) {
                const email = response.data?.body?.email;
                setSuccess("Signup successful. Redirecting...");
                setError("");

                setTimeout(() => {
                    navigate("/verify-otp", { state: { email } });
                }, 1000);
            }
        } catch (err) {
            setError(err?.response?.data?.message || "Failed to signup");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <h1>Sign Up</h1>

            <Form noValidate validated={validated} onSubmit={handleSubmit}>
                {[
                    { name: "firstName", label: "First Name" },
                    { name: "lastName", label: "Last Name" },
                    { name: "username", label: "Username" },
                    { name: "email", label: "Email", type: "email" },
                    { name: "password", label: "Password", type: "password" },
                    { name: "confirmPassword", label: "Confirm Password", type: "password" },
                ].map(({ name, label, type }) => (
                    <Form.Group className="form-control" key={name}>
                        <Form.Label>{label}</Form.Label>
                        <Form.Control
                            required
                            type={type || "text"}
                            name={name}
                            onChange={handleChange}
                            placeholder={`Enter your ${label}`}
                            className="form-control"
                        />
                        <Form.Control.Feedback type="invalid">
                            {label} is required
                        </Form.Control.Feedback>
                    </Form.Group>
                ))}

                {error && <p className="error">{error}</p>}
                {success && <p className="success">{success}</p>}

                <div className="recaptcha-container">
                    <ReCAPTCHA
                        sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                        size="invisible"
                        ref={recaptchaRef}
                    />
                </div>

                <div className="auth-options">
                    <Link className="text-link" to="/login">
                        Already have an account? Login
                    </Link>
                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? "Signing up..." : "Sign Up"}
                    </button>
                </div>
            </Form>
        </div>
    );
};

export default Signup;
