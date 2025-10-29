const express = require("express")

const router = express.Router();
const { verifyToken } = require("../middleware/authMiddleware")
const {
    validateCreateTask,
    validateTaskQuery,
    validateUpdateTask,
    checkTaskId,
    validateArchiveTask,
    validatePaginationQuery,
    validateDeleteTask,
    validateDashboardLayout } = require("../middleware/Tasks/validateTasks")
const {
    getTasks,
    getTaskDetail,
    createTask,
    updateTask,
    archiveToggle,
    getArchivedTasks,
    deleteToggle,
    getDeletedTasks,
    hardDeleteTask
} = require("../controller/Tasks/taskController")

const { updateDashboardLayout } = require("../controller/Tasks/dashboardController");

router.get("/", verifyToken, validatePaginationQuery, validateTaskQuery, getTasks);
router.get("/detail/:taskId", verifyToken, checkTaskId, getTaskDetail)
router.get("/archive", verifyToken, validatePaginationQuery, validateTaskQuery, getArchivedTasks)
router.get("/delete", verifyToken, validatePaginationQuery, validateTaskQuery, getDeletedTasks)

router.post('/', verifyToken, validateCreateTask, createTask);
router.post("/archive/:taskId", verifyToken, checkTaskId, validateArchiveTask, archiveToggle)

router.patch("/:taskId", verifyToken, checkTaskId, validateUpdateTask, updateTask);

router.delete("/:taskId", verifyToken, checkTaskId, validateDeleteTask, deleteToggle)
router.delete("/hard-delete/:taskId", verifyToken, checkTaskId, hardDeleteTask)



router.put("/dashboard/layout", verifyToken, validateDashboardLayout, updateDashboardLayout);

module.exports = router;