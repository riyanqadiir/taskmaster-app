const { body, validationResult } = require('express-validator');
const jwt = require("jsonwebtoken");

// Common error handler
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const formattedErrors = {};
        errors.array().forEach(err => {
            formattedErrors[err.path] = err.msg;
        });
        return res.status(400).json({ errors: formattedErrors });
    }
    next();
};

// Validators
const validateSignup = [
    body('firstName')
        .isString().withMessage('First name must be a string')
        .notEmpty().withMessage('First name is required'),

    body('lastName')
        .isString().withMessage('Last name must be a string')
        .notEmpty().withMessage('Last name is required'),

    body('username')
        .isString().withMessage('Username must be a string')
        .notEmpty().withMessage('Username is required')
        .customSanitizer(value => value?.toLowerCase().trim()),

    body('email')
        .isEmail().withMessage('A valid email is required')
        .customSanitizer(value => value?.toLowerCase().trim()),

    body('password')
        .isString().withMessage('Password must be a string')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),

    handleValidationErrors,
];

const validateLogin = [
    body('email')
        .isEmail().withMessage('A valid email is required')
        .customSanitizer(value => value?.toLowerCase().trim()),

    body('password')
        .isString().withMessage('Password must be a string')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),

    handleValidationErrors,
];

const validateOtp = [
    body('email')
        .isEmail().withMessage('A valid email is required')
        .customSanitizer(value => value?.toLowerCase().trim()),

    body('otp')
        .isLength({ min: 6, max: 6 }).withMessage('OTP must be exactly 6 digits')
        .isNumeric().withMessage('OTP must contain only numbers'),

    handleValidationErrors,
];

const validateResendOtp = [
    body('email')
        .isEmail().withMessage('A valid email is required')
        .customSanitizer(value => value?.toLowerCase().trim()),
    handleValidationErrors
];

const validateForgotPassword = [
    body('email')
        .isEmail().withMessage('A valid email is required')
        .customSanitizer(value => value?.toLowerCase().trim()),
    handleValidationErrors
];


const validateResetPassword = [
    body('email')
        .isEmail().withMessage('A valid email is required')
        .customSanitizer(value => value?.toLowerCase().trim()),

    body('password')
        .notEmpty().withMessage('Password is required')
        .isString().withMessage('Password must be a string')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),

    body('confirmPassword')
        .notEmpty().withMessage('Confirm password is required')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Confirm password does not match password');
            }
            return true;
        }),

    handleValidationErrors
];

const verifyToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: "Invalid or expired token" });
        }
        req.user = decoded;
        next();
    });
};

const verifyRefreshToken = (req, res, next) => {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
        return res.status(401).json({ message: 'Refresh token missing' });
    }

    jwt.verify(refreshToken, process.env.REFRESH_SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid or expired refresh token' });
        }
        req.user = user;
        next();
    });
};

const verifyCaptcha = async (req, res, next) => {
    const token = req.body.token ?? req.body["g-recaptcha-response"];

    if (!token) {
        return res.status(400).json({ message: "Missing reCAPTCHA token" });
    }

    try {
        const secretKey = process.env.RECAPTCHA_SECRET_KEY;
        const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: `secret=${secretKey}&response=${token}`,
        });

        const data = await response.json();

        if (!data.success) {
            return res.status(400).json({ message: "reCAPTCHA verification failed" });
        }

        next();
    } catch (err) {
        console.error("Captcha verification error:", err);
        return res.status(500).json({ message: "Captcha verification error" });
    }
};


module.exports = {
    validateSignup,
    validateLogin,
    validateOtp,
    validateResendOtp,
    validateForgotPassword,
    validateResetPassword,
    verifyToken,
    verifyRefreshToken,
    verifyCaptcha
};
