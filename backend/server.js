require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("./config/db.js");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const userRoute = require("./routes/userRoute.js");
const taskRoute = require("./routes/taskRoute.js");
const userProfile = require("./routes/userProfileRoute");
const path = require("path");
const fs = require("fs");

// Connect DB
mongoose();

app.set("view engine", "ejs");
app.set("views", "views");

// Middlewares
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Correct CORS
const allowedOrigins = [
    process.env.DEVELOPMENT_ENV,
    process.env.FRONTEND_URL,
];

app.use(
    cors({
        origin: function (origin, callback) {
            // Allow requests with no origin (mobile apps, curl, Postman)
            if (!origin) return callback(null, true);

            if (allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                console.log("❌ BLOCKED BY CORS:", origin);
                callback(new Error("Not allowed by CORS"));
            }
        },
        credentials: true,
        exposedHeaders: ["authorization"],
    })
);

// Needed for cookie-based refreshToken
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Credentials", "true");
    next();
});


// Routes
app.use("/user", userRoute, userProfile);
app.use("/tasks", taskRoute);

// Temp folder
const tempPath = path.join(__dirname, "/public/temp");
if (!fs.existsSync(tempPath)) {
    fs.mkdirSync(tempPath, { recursive: true });
}

// For local development only
if (!process.env.VERCEL) {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`server running on port ${PORT}`);
    });
}

module.exports = app;
