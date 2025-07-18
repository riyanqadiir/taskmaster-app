import React, { useState } from 'react';
import './auth.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false,
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { email, password, rememberMe } = formData;

        if (!email || !password) {
            setError('All fields are required.');
            setSuccess('');
            return;
        }

        try {
            const response = await axios.post('http://localhost:3000/user/login', {
                email,
                password,
                rememberMe
            }, {
                headers: { 'Content-Type': 'application/json' }
            });

            if (response.status === 200 || response.status === 201) {
                setSuccess('Login successful!');
                setError('');
                setTimeout(() => navigate('/dashboard'), 1500); // redirect example
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

                <div className="remember-me">
                    <input
                        type="checkbox"
                        name="rememberMe"
                        id="rememberMe"
                        checked={formData.rememberMe}
                        onChange={handleChange}
                    />
                    <label htmlFor="rememberMe">Remember Me</label>
                </div>

                {error && <p className="error">{error}</p>}
                {success && <p className="success">{success}</p>}

                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;
