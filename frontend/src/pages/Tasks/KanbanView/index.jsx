import { useEffect, useMemo, useState, useCallback } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { fetchTasks, updateTask as patchUpdateTask } from "../../../api/tasksApi";
import { useAuth } from "../../../context/AuthContext";
import { useTaskContext } from "../../../context/TaskContext";
import StatusCard from "./StatusCard";
import TaskModal from "../TaskModal"
import {
    DndContext,
    DragOverlay,
} from "@dnd-kit/core";
import TaskCard from "./TaskCard";
import "./Kanban.css";

const STATUS_KEYS = ["not_started", "waiting", "in_progress", "completed"];
export default function Dashboard() {
    const [loading, setLoading] = useState(true);
    const [tasks, setTasks] = useState({
        not_started: [],
        in_progress: [],
        completed: [],
        waiting: []
    });
    const [activeTaskId, setActiveTaskId] = useState(null);
    const { user } = useAuth();
    const { showModal, setShowModal, mode, setMode, initialValues, setInitialValues } = useTaskContext();



    const loadTasks = useCallback(async () => {
        try {
            setLoading(true);
            const { data } = await fetchTasks({ limit: "all" });
            // group once; avoid multiple setState calls
            const grouped = data.tasks.reduce(
                (acc, t) => {
                    const key = STATUS_KEYS.includes(t.status) ? t.status : "not_started";
                    acc[key].push(t);
                    return acc;
                },
                { not_started: [], waiting: [], in_progress: [], completed: [] }
            );
            setTasks(grouped);
        } catch (err) {
            console.error("Error loading tasks:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    const updateTask = useCallback(async (taskId, status) => {
        try {
            await patchUpdateTask(taskId, { status });
            setTasks((prev) => {
                const next = { not_started: [], waiting: [], in_progress: [], completed: [] };
                for (const k of STATUS_KEYS) next[k] = prev[k].filter((t) => t._id !== taskId);
                const moved = Object.values(prev).flat().find((t) => t._id === taskId) ?? null;
                if (moved) {
                    next[status].push({ ...moved, status });
                }
                return next;
            });
        } catch (err) {
            console.error("Error updating task status:", err);
        }
    }, []);

    useEffect(() => {
        loadTasks();
    }, [loadTasks]);

    const allTasksById = useMemo(() => {
        const map = new Map();
        for (const list of Object.values(tasks)) for (const t of list) map.set(t._id, t);
        return map;
    }, [tasks]);
    const handleTaskUpdated = useCallback((updatedTask) => {
        if (updatedTask) {
            setTasks((prev) => {
                const next = {
                    not_started: [...prev.not_started],
                    waiting: [...prev.waiting],
                    in_progress: [...prev.in_progress],
                    completed: [...prev.completed],
                };
                // 1️⃣ Find which list the task originally belonged to
                const originalKey = Object.keys(next).find((key) =>
                    next[key].some((t) => t._id === updatedTask._id)
                );
                // 2️⃣ Remove it from that list
                if (originalKey) {
                    next[originalKey] = next[originalKey].filter((t) => t._id !== updatedTask._id);
                }
                const destKey = updatedTask.status;
                // 3️⃣ If it’s the same list, replace in-place (keep same index)
                if (originalKey === destKey) {
                    const originalIndex = prev[destKey].findIndex((t) => t._id === updatedTask._id);
                    if (originalIndex !== -1) {
                        next[destKey].splice(originalIndex, 0, updatedTask);
                    } else {
                        next[destKey] = [updatedTask, ...next[destKey]]; // fallback
                    }
                } else {
                    // 4️⃣ If status changed, add to top of new list
                    next[destKey] = [updatedTask, ...next[destKey]];
                }
                return next;
            });
        }
        setShowModal(false);
    }, []);

    const handleNewTask = (task) => {
        setTasks((prev) => ({
            ...prev,
            [task.status]: [task, ...prev[task.status]]
        }));
    }
    return (
        <Container fluid className=" text-center dashboard-page">
            <h1 className="dashboard-title">Welcome! {user?.firstName ?? ""} {user?.lastName ?? ""}</h1>

            <Row className="dashboard-row">
                <DndContext
                    // sensors, collision, autoScroll as you set previously
                    onDragStart={(e) => setActiveTaskId(e.active.id)}
                    onDragCancel={() => setActiveTaskId(null)}
                    onDragEnd={({ active, over }) => {
                        if (!over) { setActiveTaskId(null); return; }

                        const destStatus = String(over.id).toLowerCase().trim();
                        const srcTask = allTasksById.get(active.id);
                        if (!srcTask || srcTask.status === destStatus) { setActiveTaskId(null); return; }

                        // 1) Optimistically move in local state FIRST
                        setTasks(prev => {
                            const next = { not_started: [], waiting: [], in_progress: [], completed: [] };
                            for (const k of Object.keys(prev)) next[k] = prev[k].filter(t => t._id !== active.id);
                            next[destStatus].push({ ...srcTask, status: destStatus });
                            return next;
                        });

                        // 2) Only after state is set, clear overlay on the next frame
                        requestAnimationFrame(() => setActiveTaskId(null));

                        // 3) Persist to API (no await needed)
                        updateTask(active.id, destStatus);
                    }}
                >
                    <Col xs={12} lg={3}>
                        <StatusCard
                            statusKey="not_started"
                            title="Not started"
                            tasks={tasks.not_started}
                            loading={loading}
                            count={tasks.not_started.length}
                            activeTaskId={activeTaskId}
                            setInitialValues={setInitialValues}
                            setShowModal={setShowModal}
                            setMode={setMode}
                        />
                    </Col>
                    <Col xs={12} lg={3}>
                        <StatusCard
                            statusKey="waiting"
                            title="Waiting"
                            tasks={tasks.waiting}
                            loading={loading}
                            count={tasks.waiting.length}
                            activeTaskId={activeTaskId}
                            setInitialValues={setInitialValues}
                            setShowModal={setShowModal}
                            setMode={setMode}
                        />
                    </Col>
                    <Col xs={12} lg={3}>
                        <StatusCard
                            statusKey="in_progress"
                            title="In progress"
                            tasks={tasks.in_progress}
                            loading={loading}
                            count={tasks.in_progress.length}
                            activeTaskId={activeTaskId}
                            setInitialValues={setInitialValues}
                            setShowModal={setShowModal}
                            setMode={setMode}
                        />
                    </Col>
                    <Col xs={12} lg={3}>
                        <StatusCard
                            statusKey="completed"
                            title="Completed"
                            tasks={tasks.completed}
                            loading={loading}
                            count={tasks.completed.length}
                            activeTaskId={activeTaskId}
                            setInitialValues={setInitialValues}
                            setShowModal={setShowModal}
                            setMode={setMode}
                        />
                    </Col>

                    <DragOverlay
                        dropAnimation={{
                            duration: 220,
                            easing: "cubic-bezier(.2,.8,.2,1)",
                            dragSourceOpacity: 0.2,
                        }}
                    >
                        {activeTaskId ? (
                            <TaskCard task={allTasksById.get(activeTaskId)} isOverlay />
                        ) : null}
                    </DragOverlay>
                </DndContext>
            </Row>
            <TaskModal
                show={showModal}
                handleClose={() => setShowModal(false)}
                onTaskCreated={(newTask) => handleNewTask(newTask)}
                onTaskUpdated={handleTaskUpdated}
                mode={mode}
                initialValues={initialValues}
            />
        </Container>
    );
}