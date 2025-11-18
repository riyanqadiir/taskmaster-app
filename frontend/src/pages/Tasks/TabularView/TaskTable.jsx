import React from 'react'
import { Button, Table, Badge } from "react-bootstrap";
import { PencilSquare, Trash, CheckCircle, InfoCircle, FileX, Archive, FileCheck } from "react-bootstrap-icons";
import { useLocation } from 'react-router-dom';
function TaskTable({ onEdit, onComplete, onSoftDeleteToggle, onDetails, tasks, onArchiveToggle, onHardDelete }) {
    const location = useLocation();
    return (
        <>
            <Table striped bordered hover responsive className="shadow-sm " >
                <thead className="table-light">
                    <tr>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Status</th>
                        <th>Priority</th>
                        <th>Due Date</th>
                        <th className="text-center text-nowrap" style={{ width: '1%' }}>Actions</th>

                    </tr>
                </thead>
                <tbody>
                    {tasks.length > 0 ? (
                        tasks.map((task) => (
                            <tr key={task._id}>
                                <td>{task.title}</td>
                                <td title={task.description}>
                                    {task.description}
                                </td>
                                <td className="text-center">
                                    <Badge
                                        className="w-100"
                                        bg={
                                            task.status === "completed"
                                                ? "success"
                                                : task.status === "in_progress"
                                                    ? "info"
                                                    : task.status === "waiting"
                                                        ? "warning"
                                                        : "secondary"
                                        }
                                    >
                                        {task.status}
                                    </Badge>
                                </td>
                                <td className="text-center">
                                    <Badge
                                        className="w-100"
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
                                </td>
                                <td className="text-center">
                                    {task.dueDate
                                        ? new Date(task.dueDate).toLocaleDateString()
                                        : "-"}
                                </td>
                                <td className="text-center text-nowrap">
                                    <div className="btn-group btn-group-sm" role="group">
                                        {location.pathname === "/tasks" && <Button
                                            variant="outline-success"
                                            onClick={() => onComplete(task._id)}
                                            title="Mark complete"
                                            aria-label="Mark complete"
                                        >
                                            <CheckCircle size={16} />
                                        </Button>}

                                        {!task.isDeleted && <Button
                                            variant="outline-primary"
                                            onClick={() => onEdit(task)}
                                            title="Edit"
                                            aria-label="Edit task"
                                        >
                                            <PencilSquare size={16} />
                                        </Button>}

                                        {!task.archived && <Button
                                            variant={task.isDeleted ? "outline-primary" : "outline-danger"}
                                            onClick={() => onSoftDeleteToggle(task._id, task.isDeleted)}
                                            title={task.isDeleted ? "Restore Task" : "Delete Task"}
                                            aria-label={task.isDeleted ? "Restore task" : "Delete task"}
                                        >
                                            {task.isDeleted ? <FileCheck size={16} /> : <FileX size={16} />}
                                        </Button>}
                                        {task.isDeleted && <Button
                                            variant="outline-danger"
                                            onClick={() => onHardDelete(task._id)}
                                            title="Delete"
                                            aria-label="Permanently Delete task"
                                        >
                                            <Trash size={16} />
                                        </Button>}
                                        {!task.isDeleted && <Button
                                            variant="outline-primary"
                                            onClick={() => onArchiveToggle(task._id, task.archived)}
                                            title={task.archived ? "Un Archive" : "Archive"}
                                            aria-label={task.archived ? "Un Archive" : "Archive"}
                                        >
                                            <Archive size={16} />
                                        </Button>}
                                        <Button
                                            variant="outline-info"
                                            onClick={() => onDetails(task._id)}
                                            title="Details"
                                            aria-label="View details"
                                        >
                                            <InfoCircle size={16} />
                                        </Button>

                                    </div>
                                </td>

                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" className="notfound text-center text-muted">
                                No tasks found
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>
        </>
    )
}

export default React.memo(TaskTable);