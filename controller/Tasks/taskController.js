const Task = require("../../model/Task/task.js");

const PRIORITY_LABELS = {
    "1": "High",
    "2": "Medium",
    "3": "Low"
};

const getTasks = async (req, res) => {
    const { _id: ownerId } = req.user;
    const { sortBy = "createdAt", order = "asc" } = req.query;
    const sortOrder = order === "desc" ? -1 : 1;

    try {
        const tasks = await Task.find({ ownerId, isDeleted: false })
            .sort({ [sortBy]: sortOrder })
            .lean();

        const formattedTasks = tasks.map(task => ({
            ...task,
            priority: PRIORITY_LABELS[task.priority] 
        }));

        res.status(200).json({ tasks: formattedTasks });
    } catch (err) {
        console.error("Error fetching tasks:", err);
        res.status(500).json({ error: "Failed to retrieve tasks" });
    }
};

const createTask = async (req, res) => {
    const { title, description, status, priority, tags, dueDate } = req.body;
    const { _id: ownerId } = req.user;

    const normalizedPriority = Object.keys(PRIORITY_LABELS).find(
        key => PRIORITY_LABELS[key].toLowerCase() === priority?.toLowerCase()
    );

    try {
        const newTask = new Task({
            ownerId,
            title,
            description,
            status,
            priority: normalizedPriority || 3, // Default to Low
            tags,
            dueDate
        });

        await newTask.save();

        res.status(201).json({ message: "Task created successfully", task: newTask });
    } catch (err) {
        console.error("Error creating task:", err);
        res.status(500).json({ message: "Server error while creating task" });
    }
};

module.exports = {
    getTasks,
    createTask
};
