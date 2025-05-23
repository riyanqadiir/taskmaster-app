const express = require("express")
const app = express();
const mongoose = require('./config/db.js');
const cors = require("cors")
const cookieParser = require("cookie-parser");
const userRoute = require("./routes/userRoute.js")
const taskRoute = require("./routes/taskRoute.js")
const userProfile = require("./routes/userProfileRoute")

const Port = process.env.PORT
require("dotenv").config()
mongoose()

app.use(cookieParser());
app.use(express.json());
app.use(cors({
    // origin: "http://localhost:5173",
    credentials: true,
    exposedHeaders: ["authorization"],
}));
app.use(express.urlencoded({ extended: true }));

app.use("/user", userRoute,userProfile)
app.use("/task", taskRoute)

app.listen(Port, () => {
    console.log(`server is listening on port ${Port}`)
})