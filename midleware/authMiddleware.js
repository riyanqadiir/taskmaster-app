const jwt = require("jsonwebtoken");

const validateSignup = (req, res, next) => {
    const { fname, lname, username, email, password } = req.body;

    if (!fname || typeof fname !== 'string') {
        return res.status(400).json({ message: "First name is required and must be a string" });
    }

    if (!lname || typeof lname !== 'string') {
        return res.status(400).json({ message: "Last name is required and must be a string" });
    }

    if (!username || typeof username !== 'string') {
        return res.status(400).json({ message: "Username is required and must be a string" });
    }

    if (!email || typeof email !== 'string' || !email.includes('@')) {
        return res.status(400).json({ message: "Valid email is required" });
    }

    if (!password || typeof password !== 'string' || password.length < 6) {
        return res.status(400).json({ message: "Password is required and must be at least 6 characters long" });
    }

    next();
};

const validateLogin = (req, res, next) => {
    const { email, password } = req.body;

    if (!email || typeof email !== 'string' || !email.includes('@')) {
        return res.status(400).json({ message: "Valid email is required" });
    }

    if (!password || typeof password !== 'string' || password.length < 6) {
        return res.status(400).json({ message: "Password is required and must be at least 6 characters long" });
    }

    next();
}


const verifyToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    //Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6...
    // console.log(authHeader) =>"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6..."
    const token = authHeader.split(" ")[1]; //to get this eyJhbGciOiJIUzI1NiIsInR5cCI6...

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


module.exports = { validateSignup, validateLogin, verifyToken,verifyRefreshToken }