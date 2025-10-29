const { body, validationResult, query, param } = require('express-validator');

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

const validateCreateTask = [
    body("title")
        .notEmpty().withMessage("Title is required")
        .isString().withMessage("Title must be a string")
        .trim(),

    body("description")
        .optional()
        .isString().withMessage("Description must be a string")
        .trim(),

    body("status")
        .optional()
        .isIn(["all", "not_started", "in_progress", "waiting", "completed"])
        .withMessage("Status must be one of: all ,not_started, in_progress, waiting, completed"),

    body("priority")
        .optional()
        .isIn(["Low", "Medium", "High"])
        .withMessage("Priority must be one of: Low, Medium, High"),

    body("tags")
        .optional()
        .isArray().withMessage("Tags must be an array")
        .custom((value) => {
            if (!value.every(tag => typeof tag === 'string')) {
                throw new Error("All tags must be strings");
            }
            return true;
        }),

    body("dueDate")
        .optional()
        .isISO8601().withMessage("Due date must be a valid ISO 8601 date"),

    handleValidationErrors
];

const validateTaskQuery = [
    query("sortBy")
        .optional()
        .isIn(["createdAt", "updatedAt", "completedAt", "dueDate", "priority", "title"])
        .withMessage("sortBy must be 'createdAt', 'updatedAt', 'completedAt', 'dueDate', 'priority', 'title'"),

    query("order")
        .optional()
        .isIn(["asc", "desc"])
        .withMessage("order must be 'asc' or 'desc'"),

    query("title")
        .optional()
        .isString().withMessage("Title must be a string")
        .trim(),
    query("status")
        .optional()
        .isIn(["all", "not_started", "in_progress", "waiting", "completed"])
        .withMessage("Status must be one of: all ,not_started, in_progress, waiting, completed"),

    handleValidationErrors
];

const validateUpdateTask = [
    body("title")
        .optional()
        .isString().withMessage("Title must be a string")
        .trim(),

    body("description")
        .optional()
        .isString().withMessage("Description must be a string")
        .trim(),

    body("status")
        .optional()
        .isIn(["all", "not_started", "in_progress", "waiting", "completed"])
        .withMessage("Status must be one of: all ,not_started, in_progress, waiting, completed"),

    body("priority")
        .optional()
        .isIn(["High", "Medium", "Low"])
        .withMessage("Priority must be High, Medium, or Low"),

    body("tags")
        .optional()
        .isArray().withMessage("Tags must be an array")
        .custom((value) => {
            if (!value.every(tag => typeof tag === "string")) {
                throw new Error("All tags must be strings");
            }
            return true;
        }),
    body("dueDate")
        .optional()
        .isISO8601().withMessage("Due date must be a valid ISO 8601 date"),

    handleValidationErrors
];
const validatePaginationQuery = [
    query("page")
        .optional()
        .isInt({ min: 1 }).withMessage("Page number must be a positive integer"),

    query("limit")
        .optional()
        .custom((value) => {
            if (value === "all") {
                return true;
            } // allow 'all'
            if (!Number.isInteger(Number(value)) || Number(value) < 1) {
                throw new Error("Limit must be a positive integer or 'all'");
            }
            return true;
        }),

    handleValidationErrors
];

const checkTaskId = [
    param("taskId")
        .isMongoId()
        .withMessage("Invalid Task ID"),

    handleValidationErrors
]
const validateArchiveTask = [
    body("archive")
        .isBoolean()
        .withMessage("Archive must be a boolean value"),

    handleValidationErrors
]
const validateDeleteTask = [
    body("deleted")
        .isBoolean()
        .withMessage("Deleted must be a boolean value"),

    handleValidationErrors
]
const validateDashboardLayout = [
    body("layout")
        .isArray({ min: 1 })
        .withMessage("Layout must be a non-empty array"),

    body("layout.*.id")
        .notEmpty()
        .withMessage("Each layout item must have an id")
        .isString()
        .withMessage("Widget id must be a string"),

    body("layout.*.title")
        .optional()
        .isString()
        .withMessage("Widget title must be a string"),

    body("layout.*.size")
        .optional()
        .isInt({ min: 1, max: 12 })
        .withMessage("Widget size must be between 1 and 12"),

    body("layout.*.position")
        .optional()
        .isInt({ min: 0 })
        .withMessage("Widget position must be a positive integer"),

    handleValidationErrors
];

module.exports = { validateCreateTask, validateTaskQuery, validateUpdateTask, checkTaskId, validateArchiveTask, validatePaginationQuery,validateDeleteTask,validateDashboardLayout };
