import React, { useState, useRef } from 'react';
import "../auth.css";
import ReCAPTCHA from "react-google-recaptcha";
import { forgotPassword } from "../../../api/userApi"
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
    });
    const recaptchaRef = useRef();
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        const { email } = formData;

        if (loading) return;
        setLoading(true);

        if (!email) {
            setError('Email is required!');
            setSuccess('');
            return;
        }

        try {
            const token = await recaptchaRef.current.executeAsync();
            recaptchaRef.current.reset();

            const response = await forgotPassword({
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
        } finally {
            setLoading(false);

        }
    };
    return (
        <div className="auth">
            <div className="auth-container">
                <h1>Forgot Password</h1>
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
                        />
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

                    <button type="submit" disabled={loading}>
                        {loading ? "Sending..." : "Submit"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;
