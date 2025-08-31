import React from 'react'

import { Card, ListGroup, Badge, Button, Spinner } from "react-bootstrap";

function StatusCard({ title, tasks, loading, onComplete }) {
    return (
        <>
            <Card className="mb-3 shadow-sm">
                <Card.Header className="d-flex justify-content-between align-items-center">
                    <span className="fw-semibold">{title}</span>
                    {loading && <Spinner animation="border" size="sm" />}
                </Card.Header>
                <ListGroup variant="flush">
                    {!loading && tasks.length === 0 && (
                        <ListGroup.Item className="text-muted">No tasks</ListGroup.Item>
                    )}
                    {tasks.map((task) => (
                        <ListGroup.Item
                            key={task._id}
                            className="d-flex justify-content-between align-items-start"
                        >
                            <div>
                                <div className="fw-semibold">{task.title}</div>
                                <small className="text-muted">
                                    {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No due date"}
                                </small>
                            </div>
                            <div className="text-end">
                                <Badge
                                    bg={
                                        task.priority === "High"
                                            ? "danger"
                                            : task.priority === "Medium"
                                                ? "warning"
                                                : "secondary"
                                    }
                                >
                                    {task.priority}
                                </Badge>
                                {onComplete && (
                                    <div>
                                        <Button
                                            size="sm"
                                            className="ms-2 mt-2"
                                            variant="outline-success"
                                            onClick={() => onComplete(task._id)}
                                        >
                                            Mark done
                                        </Button>
                                    </div>
                                )}
                                {
                                    
                                }
                            </div>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            </Card>
        </>
    )
}

export default StatusCard