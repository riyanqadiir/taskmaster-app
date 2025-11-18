require("dotenv").config()
const express = require("express")
const app = express();
const mongoose = require('./config/db.js');
const cors = require("cors")
const cookieParser = require("cookie-parser");
const userRoute = require("./routes/userRoute.js")
const taskRoute = require("./routes/taskRoute.js")
const userProfile = require("./routes/userProfileRoute")
const path = require("path")
const fs = require("fs")

mongoose()

app.set("view engine", "ejs");
app.set("views", "views");

app.use(cookieParser());
app.use(express.json());
app.use(cors({
    origin: [
    "http://localhost:5173",
    "https://taskmaster-app-7k7k.vercel.app"
],
    credentials: true,
    exposedHeaders: ["authorization"],
}));
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Credentials", "true");
    next();
});

app.use("/user", userRoute, userProfile)
app.use("/tasks", taskRoute)

if (!fs.existsSync(path.join(__dirname, "/public/temp"))) {
    fs.mkdir(path.join(__dirname, "/public/temp"), { recursive: true }, (err) => {
        if (err) {
            return console.log(err)
        }
    })
}

if (!process.env.VERCEL) {
    app.listen(process.env.PORT || 3000, () => {
        console.log(`server running on port ${process.env.PORT}`);
    });
}

module.exports = app;