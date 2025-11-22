import React, { useState, useRef } from "react";
import "../auth.css";
import ReCAPTCHA from "react-google-recaptcha";
import { login } from "../../../api/userApi";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { Form } from "react-bootstrap";

const Login = () => {
    const [loading, setLoading] = useState(false);
    const [validated, setValidated] = useState(false);

    const navigate = useNavigate();
    const recaptchaRef = useRef();
    const { setUser } = useAuth();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        remember_me: false,
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e) => {
        const { name, type, value, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
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

            const res = await login({ ...formData, token });

            if (res.status === 200) {
                const accessToken = res.headers["authorization"];
                const { user, layout, baseLayout, message } = res.data;

                localStorage.setItem("accessToken", accessToken);
                localStorage.setItem("user", JSON.stringify(user));

                if (layout)
                    localStorage.setItem("dashboardLayout", JSON.stringify(layout));
                if (baseLayout)
                    localStorage.setItem("baseLayout", JSON.stringify(baseLayout));

                setUser(user);
                setSuccess(message);

                setTimeout(() => navigate("/dashboard"), 1000);
            }
        } catch (err) {
            setError(err.response?.data?.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <h1>Login</h1>

            <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Form.Group className="form-control">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        required
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleChange}
                        className="form-control"
                    />
                    <Form.Control.Feedback type="invalid">
                        Email is required
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="form-control">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        required
                        type="password"
                        name="password"
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleChange}
                        className="form-control"
                    />
                    <Form.Control.Feedback type="invalid">
                        Password is required
                    </Form.Control.Feedback>
                </Form.Group>

                <div className="auth-options">
                    <div className="remember_me">
                        <input
                            type="checkbox"
                            name="remember_me"
                            id="remember_me"
                            checked={formData.remember_me}
                            onChange={handleChange}
                        />
                        <label htmlFor="remember_me">Remember Me</label>
                    </div>

                    <Link className="text-link" to="/forgot-password">
                        Forgot Password?
                    </Link>
                </div>

                {error && <p className="error">{error}</p>}
                {success && <p className="success">{success}</p>}

                <div className="recaptcha-container">
                    <ReCAPTCHA
                        sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                        size="invisible"
                        ref={recaptchaRef}
                    />
                </div>

                <button type="submit" className="btn-primary" disabled={loading}>
                    {loading ? "Logging in..." : "Login"}
                </button>

                <div className="auth-redirect">
                    <p>
                        Don't have an account?{" "}
                        <Link className="text-link" to="/signup">
                            Create one
                        </Link>
                    </p>
                </div>
            </Form>
        </div>
    );
};

export default Login;
