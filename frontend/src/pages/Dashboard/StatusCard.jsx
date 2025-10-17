// StatusCard.jsx
import { useDroppable } from "@dnd-kit/core";
import { Card, ListGroup, Spinner } from "react-bootstrap";
import DraggableTaskCard from "./DraggableTaskCard";
import { useCallback } from "react";
function StatusCard(props) {
    const { title, statusKey, tasks, loading, count, activeTaskId,setInitialValues,setShowModal,setMode } = props;
    const { setNodeRef, isOver } = useDroppable({ id: statusKey });
    const onEdit = useCallback((task) => {
        setMode("edit")
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
        </>
    );
}

export default StatusCard;
