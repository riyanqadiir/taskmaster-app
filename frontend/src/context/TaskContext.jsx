// src/context/TaskContext.jsx
import { createContext, useContext, useState, useCallback } from "react";
import { fetchTasks } from "../api/tasksApi";

const TaskContext = createContext();

const STATUS_KEYS = ["not_started", "waiting", "in_progress", "completed"];

const createEmptyGroups = () => ({
    not_started: [],
    waiting: [],
    in_progress: [],
    completed: [],
});

export const TaskProvider = ({ children }) => {
    // 🔹 Modal / form state (same as before)
    const [showModal, setShowModal] = useState(false);
    const [mode, setMode] = useState("add");
    const [initialValues, setInitialValues] = useState({
        _id: "",
        title: "",
        description: "",
        status: "",
        priority: "",
        dueDate: "",
    });

    // 🔹 Single source of truth for KANBAN tasks (grouped by status)
    const [tasks, setTasks] = useState(() => createEmptyGroups());

    // 🔹 Load ALL tasks for Kanban (grouped)
    const loadTasks = useCallback(async () => {
        try {
            const { data } = await fetchTasks({ limit: "all" });

            const grouped = (data?.tasks || []).reduce(
                (acc, t) => {
                    const key = STATUS_KEYS.includes(t.status)
                        ? t.status
                        : "not_started";
                    acc[key].push(t);
                    return acc;
                },
                createEmptyGroups()
            );

            setTasks(grouped);
        } catch (err) {
            console.error("Failed to load tasks for Kanban:", err);
        }
    }, []);

    // 🔹 Add a new task into the grouped structure (used by Kanban + Tabular)
    const addTaskToGroups = useCallback((task) => {
        const key = STATUS_KEYS.includes(task.status)
            ? task.status
            : "not_started";

        setTasks((prev) => ({
            ...prev,
            [key]: [task, ...(prev[key] || [])],
        }));
    }, []);

    // 🔹 Update an existing task inside grouped tasks (used by Kanban + Tabular)
    const updateTaskInGroups = useCallback((updatedTask) => {
        if (!updatedTask?._id) return;

        setTasks((prev) => {
            const next = {
                not_started: [...prev.not_started],
                waiting: [...prev.waiting],
                in_progress: [...prev.in_progress],
                completed: [...prev.completed],
            };

            // 1️⃣ Find where the task currently lives
            const originalKey = Object.keys(next).find((key) =>
                next[key].some((t) => t._id === updatedTask._id)
            );

            if (originalKey) {
                next[originalKey] = next[originalKey].filter(
                    (t) => t._id !== updatedTask._id
                );
            }

            const destKey = STATUS_KEYS.includes(updatedTask.status)
                ? updatedTask.status
                : "not_started";

            // 2️⃣ If status unchanged, try to keep original index
            if (originalKey === destKey) {
                const originalIndex = prev[destKey].findIndex(
                    (t) => t._id === updatedTask._id
                );
                if (originalIndex !== -1) {
                    next[destKey].splice(originalIndex, 0, updatedTask);
                } else {
                    next[destKey] = [updatedTask, ...next[destKey]];
                }
            } else {
                // 3️⃣ Status changed → add to top of destination column
                next[destKey] = [updatedTask, ...next[destKey]];
            }

            return next;
        });
    }, []);

    const value = {
        // modal / form
        showModal,
        setShowModal,
        mode,
        setMode,
        initialValues,
        setInitialValues,

        // kanban tasks (grouped)
        tasks,
        setTasks,
        loadTasks,
        addTaskToGroups,
        updateTaskInGroups,
    };

    return (
        <TaskContext.Provider value={value}>
            {children}
        </TaskContext.Provider>
    );
};

export const useTaskContext = () => useContext(TaskContext);
