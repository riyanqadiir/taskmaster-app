const jwt = require("jsonwebtoken");

const { body, validationResult } = require('express-validator');


const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        const formattedErrors = {};
        errors.array().forEach(err => {
            formattedErrors[err.path] = err.msg;
        });
        return res.status(400).json({ errors: formattedErrors });
    }
    next()
};


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
        .customSanitizer(value => value.toLowerCase().trim()),

    body('email')
        .isEmail().withMessage('A valid email is required')
        .customSanitizer(value => value.toLowerCase().trim()),

    body('password')
        .isString().withMessage('Password must be a string')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),

    handleValidationErrors,
];

const validateLogin = [
    body('email')
        .isEmail().withMessage('A valid email is required')
        .customSanitizer(value => value.toLowerCase().trim()),

    body('password')
        .isString().withMessage('Password must be a string')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),

    handleValidationErrors,
];

const validateOtp = [
    body('email')
        .isEmail().withMessage('A valid email is required')
        .customSanitizer(value => value.toLowerCase().trim()),
    body("otp")
    .isLength({ min: 6, max: 6 }).withMessage("OTP must be exactly 6 digits")
    .isNumeric().withMessage("OTP must contain only numbers"),
    handleValidationErrors,
]
const verifyToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    //Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6...
    // console.log(authHeader) =>"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6..."
    const token = authHeader.split(" ")[1];//to get this eyJhbGciOiJIUzI1NiIsInR5cCI6...

    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (err) {
            console.error("JWT verification failed:", err.message);
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


module.exports = { validateSignup, validateLogin, verifyToken, verifyRefreshToken,validateOtp }