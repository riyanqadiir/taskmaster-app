// StatusCard.jsx
import { useDroppable } from "@dnd-kit/core";
import { Card, ListGroup, Spinner } from "react-bootstrap";
import DraggableTaskCard from "./DraggableTaskCard";

function StatusCard({ title, statusKey, tasks, loading, count, activeTaskId }) {
    const { setNodeRef, isOver } = useDroppable({ id: statusKey });

    return (
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
                        <DraggableTaskCard key={task._id} task={task} />
                    ))}
            </ListGroup>
        </Card>
    );
}

export default StatusCard;
