import React, { useState, useRef } from 'react';
import "../auth.css";
import ReCAPTCHA from "react-google-recaptcha";
import api from '../../../api/axios';
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
    const {user,setUser} = useAuth();

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

            const response = await api.post('/user/login', {
                email,
                password,
                remember_me,
                token
            });

            if (response.status === 200) {
                setUser(response.data.user)
                console.log(response.data.user)
                const accessToken = response.headers['authorization'];
                localStorage.setItem("accessToken", accessToken); 
                setSuccess(response.data.message);
                setTimeout(() => navigate('/dashboard'), 1000);
            }
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Login failed');
            setSuccess('');
        }
    };
    return (
        <div className="auth-container">
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-control">
                    <label htmlFor="email">Email</label>
                    <input
                        name="email"
                        type="email"
                        placeholder="Enter your email"
                        onChange={handleChange}
                        value={formData.email}
                    />
                </div>

                <div className="form-control">
                    <label htmlFor="password">Password</label>
                    <input
                        name="password"
                        type="password"
                        placeholder="Enter your password"
                        onChange={handleChange}
                        value={formData.password}
                    />
                </div>

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
                <Link type='button' to="/forgot-password" >Forgot Password</Link>
                {error && <p className="error">{error}</p>}
                {success && <p className="success">{success}</p>}
                <ReCAPTCHA
                    sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                    size="invisible"
                    ref={recaptchaRef}
                />
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;
