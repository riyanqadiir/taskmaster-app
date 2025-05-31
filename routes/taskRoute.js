const express = require("express")

const router = express.Router();
const {verifyToken} = require("../middleware/authMiddleware")
const {validateCreateTask,validateTaskQuery} = require("../middleware/Tasks/validateTasks")
const {getTasks,createTask}  = require("../controller/Tasks/taskController")

router.get("/",verifyToken,validateTaskQuery,getTasks)
router.post('/', verifyToken, validateCreateTask, createTask);

module.exports = router;