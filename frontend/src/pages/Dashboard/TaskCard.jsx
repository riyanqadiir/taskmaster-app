// TaskCard.jsx
import { forwardRef } from "react";
import { ListGroup, Badge } from "react-bootstrap";

const TaskCard = forwardRef(function TaskCard(
    { task, isOverlay = false, isDragging = false, attributes = {}, listeners = {}, style },
    ref
) {
    const priorityClass =
        task.priority === "High"
            ? "badge-priority-high"
            : task.priority === "Medium"
                ? "badge-priority-medium"
                : "badge-priority-low";

    return (
        <ListGroup.Item
            ref={ref}
            {...attributes}
            {...listeners}
            className={`task-card d-flex justify-content-between align-items-start ${isOverlay ? "overlay" : ""
                } ${isDragging ? "dragging" : ""}`}
            style={style}
        >
            <div>
                <div className="task-title">{task.title}</div>
                <small className="task-meta">
                    {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No due date"}
                </small>
            </div>
            <div className="text-end">
                <Badge className={priorityClass}>{task.priority}</Badge>
            </div>
        </ListGroup.Item>
    );
});

export default TaskCard;
