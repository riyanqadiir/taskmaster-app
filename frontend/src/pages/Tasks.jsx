import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button, Table, Badge, Form } from "react-bootstrap";
import { PencilSquare, Trash, CheckCircle } from "react-bootstrap-icons";
import api from "../api/axios"; // your axios instance
import AddTaskModal from "../components/Task/AddTaskModal";

function Tasks() {
    const [tasks, setTasks] = useState([]);
    const [filter, setFilter] = useState("all");
    const [showModal, setShowModal] = useState(false);
    const [mode, setMode] = useState("add")
    const [initialValues, setInitialValues] = useState({})
    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const { data } = await api.get("/tasks");
                setTasks(data.tasks || []);
            } catch (err) {
                console.error("Error fetching tasks:", err.response?.data || err.message);
            }
        };
        fetchTasks();
    }, []);

    const handleEditTask = (taskId) => {
        const task = tasks.find((task) => {
            return task._id === taskId
        })
        setInitialValues({
            _id: task._id,
            title: task.title,
            description: task.description,
            status: task.status,
            priority: task.priority,
            dueDate: task.dueDate.split("T")[0]
        })
        setMode("edit")
        setShowModal(true)
    }
    const handleAddTask = () => {
        setMode("add")
        setInitialValues(null)
        setShowModal(true)
    }
    const markDelete = async (taskId) => {
        try {
            const { data } = await api.delete(`/tasks/${taskId}`);
            setTasks((prev) => {
                return prev.filter((t) => t._id != taskId)
            })

        } catch (err) {
            console.error("Error marking task delete:", err.data.message);
        }
    }
    const markComplete = async (taskId) => {
        try {
            const res = await api.patch(`/tasks/${taskId}`, { status: "completed" });
            setTasks((prev) =>
                prev.map((t) => (t._id === taskId ? res.data.task : t))
            );
        } catch (err) {
            console.error(
                "Error marking task complete:",
                err.response?.data?.message || err.message
            );
        }
    };


    const filteredTasks =
        filter === "all" ? tasks : tasks.filter((task) => task.status === filter);

    return (
        <Container fluid className="py-4">
            <Row className="align-items-center mb-4">
                <Col>
                    <h2 className="fw-bold">My Tasks</h2>
                </Col>
                <Col xs="auto">
                    <Button variant="primary" onClick={() => handleAddTask()}>+ Add Task</Button>
                </Col>
            </Row>

            <Row className="mb-3">
                <Col xs={12} md={6}>
                    <Form.Select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    >
                        <option value="all">All Tasks</option>
                        <option value="not_started">Not Started</option>
                        <option value="in_progress">In Progress</option>
                        <option value="waiting">Waiting</option>
                        <option value="completed">Completed</option>
                    </Form.Select>
                </Col>
            </Row>


            <Row>
                <Col>
                    <Table striped bordered hover responsive className="shadow-sm">
                        <thead className="table-light">
                            <tr>
                                <th>Title</th>
                                <th>Status</th>
                                <th>Priority</th>
                                <th>Due Date</th>
                                <th className="text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTasks.length > 0 ? (
                                filteredTasks.map((task) => (
                                    <tr key={task._id}>
                                        <td>{task.title}</td>
                                        <td>
                                            <Badge
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
                                        <td>
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
                                        </td>
                                        <td>
                                            {task.dueDate
                                                ? new Date(task.dueDate).toLocaleDateString()
                                                : "-"}
                                        </td>
                                        <td className="text-center">
                                            <Button
                                                size="sm"
                                                variant="outline-success"
                                                className="me-2"
                                                onClick={() => markComplete(task._id)}
                                            >
                                                <CheckCircle />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline-primary"
                                                className="me-2"
                                                onClick={() => handleEditTask(task._id)}
                                            >
                                                <PencilSquare />
                                            </Button>
                                            <Button size="sm" variant="outline-danger" onClick={() => markDelete(task._id)}>
                                                <Trash />
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center text-muted">
                                        No tasks found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </Col>
            </Row>
            <AddTaskModal
                show={showModal}
                handleClose={() => setShowModal(false)}
                onTaskCreated={(newTask) => setTasks((prev) => [...prev, newTask])}
                onTaskUpdated={(updatedTask) => setTasks((prev) => prev.map((t) => t._id === updatedTask._id ? updatedTask : t))}
                mode={mode}
                initialValues={initialValues}
            />
        </Container>
    );
}

export default Tasks;
