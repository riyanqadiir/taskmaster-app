import { useEffect, useMemo, useState, useCallback } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { fetchTasks, updateTask as patchUpdateTask } from "../../api/tasksApi";
import { useAuth } from "../../context/AuthContext";
import StatusCard from "./StatusCard";
import {
    DndContext,
    DragOverlay,
} from "@dnd-kit/core";
import TaskCard from "./TaskCard";
import "./Dashboard.css";

const STATUS_KEYS = ["not_started", "in_progress", "completed"];
export default function Dashboard() {
    const [loading, setLoading] = useState(true);
    const [tasks, setTasks] = useState({
        not_started: [],
        in_progress: [],
        completed: [],
    });
    const [activeTaskId, setActiveTaskId] = useState(null);
    const { user } = useAuth();



    const loadTasks = useCallback(async () => {
        try {
            setLoading(true);
            const { data } = await fetchTasks({limit:"all"});
            // group once; avoid multiple setState calls
            const grouped = data.tasks.reduce(
                (acc, t) => {
                    const key = STATUS_KEYS.includes(t.status) ? t.status : "not_started";
                    acc[key].push(t);
                    return acc;
                },
                { not_started: [], in_progress: [], completed: [] }
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
                const next = { not_started: [], in_progress: [], completed: [] };
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
                            const next = { not_started: [], in_progress: [], completed: [] };
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
                    <Col xs={12} lg={4}>
                        <StatusCard
                            statusKey="not_started"
                            title="Not started"
                            tasks={tasks.not_started}
                            loading={loading}
                            count={tasks.not_started.length}
                            activeTaskId={activeTaskId}
                            setTasks = {setTasks}
                        />
                    </Col>
                    <Col xs={12} lg={4}>
                        <StatusCard
                            statusKey="in_progress"
                            title="In progress"
                            tasks={tasks.in_progress}
                            loading={loading}
                            count={tasks.in_progress.length}
                            activeTaskId={activeTaskId}
                            setTasks = {setTasks}
                        />
                    </Col>
                    <Col xs={12} lg={4}>
                        <StatusCard
                            statusKey="completed"
                            title="Completed"
                            tasks={tasks.completed}
                            loading={loading}
                            count={tasks.completed.length}
                            activeTaskId={activeTaskId}
                            setTasks = {setTasks}
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
        </Container>
    );
}