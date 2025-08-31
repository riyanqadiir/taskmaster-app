import { Card, Badge } from "react-bootstrap";

const statusColor = {
    completed: "success",
    in_progress: "info",
    waiting: "warning",
    not_started: "secondary",
};

const priorityLabelMap = { 1: "High", 2: "Medium", 3: "Low" };
const priorityColor = { High: "danger", Medium: "warning", Low: "secondary" };

function TaskCard({ task }) {
    const priorityLabel =
        typeof task.priority === "number"
            ? priorityLabelMap[task.priority]
            : task.priority;

    return (
        <Card className="m-3 shadow-sm">
            <Card.Body>
                <Card.Title className="mb-2">Title: {task.title}</Card.Title>

                <div className="mb-2">
                    Status:
                    <Badge className="ms-2" bg={statusColor[task.status] || "secondary"}>
                        {task.status}
                    </Badge>
                    {task.archived && (
                        <Badge className="ms-2" bg="dark">
                            Archived
                        </Badge>
                    )}
                </div>

                <div className="mb-2">
                    Priority:
                    <Badge
                        className="ms-2"
                        bg={priorityColor[priorityLabel] || "secondary"}
                    >
                        {priorityLabel}
                    </Badge>
                </div>

                <div className="mb-2">
                    Description: {task.description || "No description"}
                </div>

                <div className="text-muted">
                    Due Date: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "—"}
                </div>
                <div className="text-muted">
                    Creation Date: {new Date(task.createdAt).toLocaleDateString()}
                </div>
            </Card.Body>
        </Card>
    );
}

export default TaskCard;
