import { useState,useCallback } from "react";
import { Card, Badge } from "react-bootstrap";


const statusColor = {
    completed: "success",
    in_progress: "info",
    waiting: "warning",
    not_started: "secondary",
};

const priorityLabelMap = { 1: "High", 2: "Medium", 3: "Low" };
const priorityColor = { High: "danger", Medium: "warning", Low: "secondary" };

function formatDate(d) {
    // sourcery skip: use-braces
    if (!d) return "—";
    const date = new Date(d);
    if (Number.isNaN(date.getTime())) return "—";
    return date.toLocaleString();
}

function TaskCard({ task }) {
    
    const priorityLabel =
        typeof task?.priority === "number"
            ? priorityLabelMap[task.priority]
            : task?.priority || "—";

    const status = task?.status || "not_started";
    const statusBg = statusColor[status] || "secondary";

    

    return (
        <>
            <Card className="td-card">
                <Card.Body>
                    <Card.Title className="td-title">
                        {task?.title || "Untitled Task"}
                    </Card.Title>

                    <div className="td-meta td-badges">
                        <div>
                            <span className="td-label">Status:</span>
                            <Badge className="ms-2 text-uppercase" bg={statusBg}>
                                {String(status).replaceAll("_", " ")}
                            </Badge>
                            {task?.archived && (
                                <Badge className="ms-2" bg="dark">
                                    Archived
                                </Badge>
                            )}
                        </div>

                        <div>
                            <span className="td-label">Priority:</span>
                            <Badge className="ms-2" bg={priorityLabel ? (priorityColor[priorityLabel] || "secondary") : "secondary"}>
                                {priorityLabel}
                            </Badge>
                        </div>
                    </div>

                    <div className="td-desc">
                        <span className="td-label">Description:</span>{" "}
                        {task?.description || "No description"}
                    </div>

                    <div className="td-dates">
                        <div><span className="td-label">Due Date:</span> {formatDate(task?.dueDate)}</div>
                        <div><span className="td-label">Created:</span> {formatDate(task?.createdAt)}</div>
                    </div>
                </Card.Body>
            </Card>
            
        </>

    );
}

export default TaskCard;
