// src/pages/Tasks/KanbanView.jsx
import { useEffect, useMemo, useState, useCallback } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { updateTask as patchUpdateTask } from "../../../api/tasksApi";
import { useAuth } from "../../../context/AuthContext";
import { useTaskContext } from "../../../context/TaskContext";
import StatusCard from "./StatusCard";
import TaskModal from "../TaskModal";
import {
    DndContext,
    DragOverlay,
} from "@dnd-kit/core";
import TaskCard from "./TaskCard";
import "./Kanban.css";

const STATUS_KEYS = ["not_started", "waiting", "in_progress", "completed"];

export default function KanbanView() {
    const [loading, setLoading] = useState(true);
    const [activeTaskId, setActiveTaskId] = useState(null);

    const { user } = useAuth();

    const {
        showModal,
        setShowModal,
        mode,
        setMode,
        initialValues,
        setInitialValues,
        tasks,
        setTasks,
        loadTasks,
        addTaskToGroups,
        updateTaskInGroups,
    } = useTaskContext();

    // 🔹 Load all tasks for Kanban from context
    useEffect(() => {
        const run = async () => {
            setLoading(true);
            await loadTasks();
            setLoading(false);
        };
        run();
    }, [loadTasks]);

    // 🔹 Map for quick access by id (used by drag overlay)
    const allTasksById = useMemo(() => {
        const map = new Map();
        for (const list of Object.values(tasks)) {
            for (const t of list) {
                map.set(t._id, t);
            }
        }
        return map;
    }, [tasks]);

    const handleTaskUpdated = useCallback((updatedTask) => {
        if (updatedTask) {
            updateTaskInGroups(updatedTask);
        }
        setShowModal(false);
    }, [updateTaskInGroups, setShowModal]);

    const handleNewTask = (task) => {
        addTaskToGroups(task);
    };

    return (
        <Container fluid className="text-center dashboard-page">
            <h1 className="dashboard-title">
                Welcome! {user?.firstName ?? ""} {user?.lastName ?? ""}
            </h1>

            <Row className="dashboard-row">
                <DndContext
                    onDragStart={(e) => setActiveTaskId(e.active.id)}
                    onDragCancel={() => setActiveTaskId(null)}
                    onDragEnd={({ active, over }) => {
                        if (!over) {
                            setActiveTaskId(null);
                            return;
                        }

                        const destStatus = String(over.id).toLowerCase().trim();
                        const srcTask = allTasksById.get(active.id);
                        if (!srcTask || srcTask.status === destStatus) {
                            setActiveTaskId(null);
                            return;
                        }

                        // 1️⃣ Optimistic update of grouped tasks in context
                        setTasks((prev) => {
                            const next = {
                                not_started: [],
                                waiting: [],
                                in_progress: [],
                                completed: [],
                            };

                            for (const k of Object.keys(prev)) {
                                next[k] = prev[k].filter(
                                    (t) => t._id !== active.id
                                );
                            }

                            next[destStatus].push({
                                ...srcTask,
                                status: destStatus,
                            });

                            return next;
                        });

                        // 2️⃣ Clear overlay after state is updated
                        requestAnimationFrame(() => setActiveTaskId(null));

                        // 3️⃣ Persist to API
                        patchUpdateTask(active.id, { status: destStatus }).catch(
                            (err) => {
                                console.error(
                                    "Error updating task status:",
                                    err
                                );
                                // optional: reload tasks on error
                                loadTasks();
                            }
                        );
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
                onTaskCreated={handleNewTask}
                onTaskUpdated={handleTaskUpdated}
                mode={mode}
                initialValues={initialValues}
            />
        </Container>
    );
}
