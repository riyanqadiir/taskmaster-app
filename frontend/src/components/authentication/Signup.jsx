// Signup.jsx
import React, { useState,useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import "./auth.css";

const Signup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const recaptchaRef = useRef();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { firstName, lastName, username, email, password, confirmPassword } = formData;

        if (!firstName || !lastName || !username || !email || !password || !confirmPassword) {
            setError('Please fill in all fields');
            return;
        }

        if (password.length < 8) {
            setError("Password must be at least 8 characters");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            const token = await recaptchaRef.current.executeAsync();
            recaptchaRef.current.reset();

            const response = await api.post("/user/signup", {...formData,token});

            if (response.status === 200 || response.status === 201) {
                const email = response.data?.body?.email;
                if (email) {
                    setSuccess('Signup successful. Redirecting to OTP verification...');
                    setError('');
                    setTimeout(() => {
                        navigate("/verify-otp", { state: { email } });
                    }, 1000);
                }
            }
        } catch (err) {
            console.log(err);
            setError(err?.response?.data?.message || "Failed to signup");
        }
    };


    return (
        <div className="auth-container">
            <h1>Sign Up</h1>
            <form onSubmit={handleSubmit}>
                {["firstName", "lastName", "username", "email", "password", "confirmPassword"].map((field) => (
                    <div className="form-control" key={field}>
                        <label htmlFor={field}>{field === "confirmPassword" ? "Confirm Password" : field.charAt(0).toUpperCase() + field.slice(1)}</label>
                        <input
                            type={(field.includes("password") || field.includes("confirmPassword")) ? "password" : "text"}
                            id={field}
                            name={field}
                            onChange={handleChange}
                            placeholder={`Enter your ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`}
                        />
                    </div>
                ))}
                {error && <p className="error">{error}</p>}
                {success && <p className="success">{success}</p>}
                <ReCAPTCHA
                    sitekey= {import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                    size="invisible"
                    ref={recaptchaRef}
                />
                <button type="submit">Sign Up</button>
            </form>
        </div>
    );
};

export default Signup;
