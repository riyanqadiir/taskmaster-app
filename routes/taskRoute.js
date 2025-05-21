const express = require("express")

const router = express.Router();
const {verifyToken} = require("../midleware/authMiddleware")
const {getTask}  = require("../controller/taskController")

router.get("/tasks",verifyToken,getTask)

module.exports = router;