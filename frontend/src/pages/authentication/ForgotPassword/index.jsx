import React, { useState,useRef } from 'react';
import "../auth.css";
import ReCAPTCHA from "react-google-recaptcha";
import api from '../../../api/axios';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
    });
    const recaptchaRef = useRef();
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        const { name, value} = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        const { email} = formData;

        if (!email) {
            setError('Email is required!');
            setSuccess('');
            return;
        }

        try {
            const token = await recaptchaRef.current.executeAsync();
            recaptchaRef.current.reset();

            const response = await api.post('/user/forgot-password', {
                email,
                token
            });

            if (response.status === 200 || response.status === 201) {
                setSuccess('Reset password link is send successfully');
                setError('');
                setTimeout(() => navigate('/login'), 1500); 
            }
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Failed to send reset link');
            console.log(err.response?.data)
            setSuccess('');
        }
    };
    ``
    return (
        <div className="auth-container">
            <h1>Forgot Password</h1>
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
                {error && <p className="error">{error}</p>}
                {success && <p className="success">{success}</p>}
                <ReCAPTCHA
                    sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                    size="invisible"
                    ref={recaptchaRef}
                />
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default ForgotPassword;
