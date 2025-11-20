import React, { useState, useRef } from 'react';
import "../auth.css";
import ReCAPTCHA from "react-google-recaptcha";
import { login } from "../../../api/userApi"
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        remember_me: false,
    });
    const recaptchaRef = useRef();
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const { setUser } = useAuth();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { email, password, remember_me } = formData;

        if (!email || !password) {
            setError('All fields are required.');
            setSuccess('');
            return;
        }

        try {
            const token = await recaptchaRef.current.executeAsync();
            recaptchaRef.current.reset();
            const response = await login({
                email,
                password,
                remember_me,
                token
            });
            if (response.status === 200) {
                const accessToken = response.headers['authorization'];
                const { user, layout, baseLayout, message } = response.data;
                // ✅ Store tokens and user info
                localStorage.setItem("accessToken", accessToken);
                localStorage.setItem("user", JSON.stringify(user));

                // ✅ Store dashboard layouts
                if (layout) localStorage.setItem("dashboardLayout", JSON.stringify(layout));
                if (baseLayout) localStorage.setItem("baseLayout", JSON.stringify(baseLayout));

                // ✅ Update context (if applicable)
                setUser(user);

                setSuccess(message);
                setTimeout(() => navigate('/dashboard'), 1000);
            }
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Login failed');
            setSuccess('');
        }
    };
    return (
        <div className="auth">
            <div className="auth-container">
                <h1>Login</h1>
                <form onSubmit={handleSubmit}>
                <div className="form-control">
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Enter your email"
                        onChange={handleChange}
                        value={formData.email}
                        aria-label="Email"
                        required
                    />
                </div>

                <div className="form-control">
                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="Enter your password"
                        onChange={handleChange}
                        value={formData.password}
                        aria-label="Password"
                        required
                    />
                </div>

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

                    <div>
                        <Link className="text-link" to="/forgot-password">Forgot Password?</Link>
                    </div>
                </div>

                {error && <p className="error">{error}</p>}
                {success && <p className="success">{success}</p>}

                {/* ensure recaptcha sits inside a container so it doesn't overlap footer */}
                <div className="recaptcha-container" style={{ position: 'relative', marginTop: '1rem' }}>
                    <ReCAPTCHA
                        sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                        size="invisible"
                        ref={recaptchaRef}
                    />
                </div>

                <button type="submit" className="btn-primary">Login</button>
                </form>
            </div>
        </div>
    );
};

export default Login;
