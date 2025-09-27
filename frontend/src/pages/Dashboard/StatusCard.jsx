// StatusCard.jsx
import { useDroppable } from "@dnd-kit/core";
import { Card, ListGroup, Spinner } from "react-bootstrap";
import DraggableTaskCard from "./DraggableTaskCard";
import { useState, useCallback } from "react";
import TaskModal from "../Tasks/TaskModal"
function StatusCard({ title, statusKey, tasks, loading, count, activeTaskId, setTasks }) {
    const { setNodeRef, isOver } = useDroppable({ id: statusKey });
    const [initialValues, setInitialValues] = useState({
        _id: "",
        title: "",
        description: "",
        status: "",
        priority: "",
        dueDate: "",
    });
    const [showModal, setShowModal] = useState(false);
    const onEdit = useCallback((task) => {
        setShowModal(true);
        setInitialValues({
            _id: task._id,
            title: task.title,
            description: task.description ?? "",
            status: task.status,
            priority: task.priority,
            dueDate: task.dueDate ? task.dueDate.split("T")[0] : ""
        });
    });
    const handleTaskUpdated = useCallback((updatedTask) => {
        if (updatedTask) {
            setTasks((prev) => {
                // 1) Remove this task from every list
                const next = {
                    not_started: prev.not_started.filter((t) => t._id !== updatedTask._id),
                    in_progress: prev.in_progress.filter((t) => t._id !== updatedTask._id),
                    completed: prev.completed.filter((t) => t._id !== updatedTask._id),
                };

                // 2) Insert (or replace) into the destination list
                const key = updatedTask.status; // "not_started" | "in_progress" | "completed"

                // If you want to keep order and replace when already in the same list:
                const replaced = next[key].some((t) => t._id === updatedTask._id);
                next[key] = replaced
                    ? next[key].map((t) => (t._id === updatedTask._id ? updatedTask : t))
                    : [...next[key], updatedTask];

                return next;
            });
        }

        setShowModal(false);
    }, []);
    return (
        <>
            <Card className="mb-3 shadow-sm status-card">
                <Card.Header className="d-flex justify-content-between align-items-center">
                    <span className="status-title"><span className="separator" />{title}</span>
                    <div className="d-flex align-items-center gap-2">
                        <span className="status-count">{count}</span>
                        {loading && <Spinner animation="border" size="sm" />}
                    </div>
                </Card.Header>

                <ListGroup
                    ref={setNodeRef}
                    variant="flush"
                    className={`task-list ${isOver ? "droppable-over" : ""}`}
                >
                    {!loading && tasks.length === 0 && (
                        <ListGroup.Item className="task-empty">No tasks</ListGroup.Item>
                    )}

                    {tasks
                        // hide the source item while it's being dragged (prevents duplicate “ghost”)
                        .filter(task => task._id !== activeTaskId)
                        .map(task => (
                            <DraggableTaskCard key={task._id} task={task} onEdit={onEdit} />
                        ))}
                </ListGroup>
            </Card>
            <TaskModal
                show={showModal}
                handleClose={() => setShowModal(false)}
                onTaskUpdated={handleTaskUpdated}
                mode="edit"
                initialValues={initialValues}
            />
        </>
    );
}

export default StatusCard;
