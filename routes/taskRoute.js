const express = require("express")

const router = express.Router();
const { verifyToken } = require("../middleware/authMiddleware")
const {
    validateCreateTask,
    validateTaskQuery,
    validateUpdateTask,
    checkTaskId,
    validateArchiveTask } = require("../middleware/Tasks/validateTasks")
const {
    getTasks,
    getTaskDetail,
    createTask,
    updateTask,
    archiveToggle,
    getArchivedTasks,
    deleteTask,
    getDeletedTasks,
    // completeTask 
} = require("../controller/Tasks/taskController")

router.get("/", verifyToken, validateTaskQuery, getTasks);
router.get("/detail/:taskId", verifyToken, checkTaskId, getTaskDetail)
router.get("/archive", verifyToken, validateTaskQuery, getArchivedTasks)
router.get("/delete", verifyToken, validateTaskQuery, getDeletedTasks)

router.post('/', verifyToken, validateCreateTask, createTask);
router.post("/archive/:taskId", verifyToken, checkTaskId, validateArchiveTask, archiveToggle)

router.patch("/:taskId", verifyToken, checkTaskId, validateUpdateTask, updateTask);

router.delete("/:taskId", verifyToken, checkTaskId, deleteTask)

module.exports = router;