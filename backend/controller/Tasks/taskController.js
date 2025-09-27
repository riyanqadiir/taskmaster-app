const Task = require("../../model/Task/task.js");

const PRIORITY_LABELS = {
    1: "High",
    2: "Medium",
    3: "Low"
};

const PRIORITY_VALUES = {
    "High": 1,
    "Medium": 2,
    "Low": 3
};

const getPagination = (total, page, limit, res) => {
    const totalPages = Math.ceil(total / limit);

    if (page > totalPages) {
        res.status(400).json({ message: `Invalid page number. The last page is ${totalPages}.` })
    }
    return {
        totalItems: total,
        currentPage: page,
        totalPages: totalPages,
        pageSize: limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
    }
}

const getFilteredTasks = async (req, res, condition = {}) => {
    const { _id: ownerId } = req.user;
    const { sortBy = "createdAt", order = "desc", title, status = "all" } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limitParam = req.query.limit;
    const limit = limitParam === "all" ? null : parseInt(limitParam) || 10;
    const sortOrder = order === "asc" ? 1 : -1;

    const startIndex = (page - 1) * limit;
    let results = {};
    try {
        const query = { ownerId, ...condition };

        if (title?.trim()) {
            query.title = { $regex: title, $options: "i" };
        }
        if (status !== "all") {
            query.status = status
        }
        const [tasks, total] = await Promise.all([
            Task.find(query)
                .sort({ [sortBy]: sortOrder })
                .skip(startIndex)
                .limit(limit || 0)
                .lean(),
            Task.countDocuments(query)
        ]);

        const formattedTasks = tasks.map((task) => ({
            ...task,
            priority: PRIORITY_LABELS[task.priority],
        }));

        results.tasks = formattedTasks;
        //getting formatted pagination
        if (total === 0) {
            results.pagination = getPagination(1, page, limit, res);
        } else {
            results.pagination = getPagination(total, page, limit, res);
        }

        res.status(200).json(results);
    } catch (err) {
        console.error("Error fetching tasks:", err);
        res.status(500).json({ error: "Failed to retrieve tasks" });
    }
};

const getTasks = (req, res) => {
    return getFilteredTasks(req, res, { isDeleted: false, archived: false });
};

const getTaskDetail = async (req, res) => {
    const { _id: ownerId } = req.user
    const { taskId } = req.params
    try {
        const task = await Task.findOne({ _id: taskId, ownerId }).lean();
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        task.priority = PRIORITY_LABELS[task.priority]

        res.status(200).json({ task: task })

    } catch (err) {
        console.error("Error fetching task detail:", err);
        res.status(500).json({ error: "Failed to retrieve task detail" });
    }
}

const createTask = async (req, res) => {
    const { title, description, status, priority, tags, dueDate } = req.body;
    const { _id: ownerId } = req.user;

    const normalizedPriority = Object.keys(PRIORITY_LABELS).find(
        key => PRIORITY_LABELS[key].toLowerCase() === priority?.toLowerCase()
    );
    if (new Date(dueDate) < new Date()) {
        return res.status(400).json({ message: "invalid due date" });
    }
    try {
        const newTask = new Task({
            ownerId,
            title,
            description,
            status,
            priority: normalizedPriority || 3,
            tags,
            dueDate
        });

        await newTask.save();

        const formattedTask = {
            ...newTask.toObject(),
            priority: PRIORITY_LABELS[newTask.priority]
        };

        res.status(201).json({ message: "Task created successfully", task: formattedTask });
    } catch (err) {
        console.error("Error creating task:", err);
        res.status(500).json({ message: "Server error while creating task" });
    }
};

const updateTask = async (req, res) => {
    const { taskId } = req.params;
    const { _id: ownerId } = req.user;
    const { title, description, status, priority, tags, dueDate } = req.body;

    try {
        const task = await Task.findOne({ _id: taskId, ownerId, isDeleted: false });

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        if (priority) {
            const normalizedPriority = PRIORITY_VALUES[priority];
            if (!normalizedPriority) {
                return res.status(400).json({ message: "Invalid priority value" });
            }
            task.priority = normalizedPriority;
        }

        if (title !== undefined) {
            task.title = title;
        }
        if (description !== undefined) {
            task.description = description;
        }
        if (status !== undefined) {
            task.status = status;
            if (task.status === 'completed') {
                task.completedAt = new Date()
            } else {
                task.completedAt = null
            }
        }
        if (tags !== undefined) {
            task.tags = tags;
        }
        if (dueDate !== undefined) {
            task.dueDate = dueDate;
        }

        await task.save();

        const formattedTask = {
            ...task.toObject(),
            priority: PRIORITY_LABELS[task.priority]
        };

        res.status(200).json({
            message: "Task updated successfully",
            task: formattedTask
        });
    } catch (err) {
        console.error("Update Task Error:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};

const archiveToggle = async (req, res) => {
    const { archive } = req.body;
    const { taskId } = req.params;
    const { _id: ownerId } = req.user;
    try {
        const task = await Task.findOne({ _id: taskId, ownerId, isDeleted: false, status: { $ne: 'completed' } })
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        task.archived = archive
        await task.save();
        if (!archive) {
            return res.status(200).json({
                message: "Task unarchived successfully!",
                task
            });
        }
        res.status(200).json({
            message: "Task archived successfully!",
            task
        });
    } catch (err) {
        console.error("Update Task Error:", err);
        res.status(500).json({ message: "Internal server error" });
    }
}

const getArchivedTasks = (req, res) => {
    return getFilteredTasks(req, res, { isDeleted: false, archived: true });
};

const deleteTask = async (req, res) => {
    const { taskId } = req.params;
    const { _id: ownerId } = req.user
    try {
        const task = await Task.findOne({ _id: taskId, ownerId, isDeleted: false, })

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        task.isDeleted = true;

        await task.save();

        res.status(200).json({
            message: "Task deleted successfully!",
            task
        });
    } catch (err) {
        console.error("Update Task Error:", err);
        res.status(500).json({ message: "Internal server error" });
    }
}


const getDeletedTasks = (req, res) => {
    return getFilteredTasks(req, res, { isDeleted: true });
};



module.exports = {
    getTasks,
    getTaskDetail,
    createTask,
    updateTask,
    archiveToggle,
    getArchivedTasks,
    deleteTask,
    getDeletedTasks,
};
