import { createContext, useContext, useState } from "react";

// 1️⃣ Create context
const TaskContext = createContext();

// 2️⃣ Create provider component
export const TaskProvider = ({ children }) => {
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
    // You can put more shared task-related state here later (like filters, selectedTask, etc.)
    const value = {
        showModal,
        setShowModal,
        mode,
        setMode,
        setInitialValues,
        initialValues
    };

    return (
        <TaskContext.Provider value={value}>
            {children}
        </TaskContext.Provider>
    );
};

// 3️⃣ Custom hook (for cleaner access)
export const useTaskContext = () => useContext(TaskContext);
