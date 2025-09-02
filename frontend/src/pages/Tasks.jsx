import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button, Table, Badge, Form, InputGroup } from "react-bootstrap";
import { PencilSquare, Trash, CheckCircle, InfoCircle } from "react-bootstrap-icons";
import api from "../api/axios"; // your axios instance
import AddTaskModal from "../components/task/AddTaskModal";
import { Link } from "react-router-dom";

function Tasks() {
    const [tasks, setTasks] = useState([]);
    const [filter, setFilter] = useState({
        sortBy: "createdAt",
        order: "desc",
        title: "",
        status: "all",
    });
    const [showModal, setShowModal] = useState(false);
    const [mode, setMode] = useState("add")
    const [initialValues, setInitialValues] = useState({})
    const [search, setSearch] = useState("")

    useEffect(() => {
        const fetchTasks = async (sortBy, order, title, status) => {
            console.log(sortBy, order, title, status)
            try {
                const { data } = await api.get("/tasks", { params: { sortBy, order, title, status } });
                setTasks(data.tasks || []);
            } catch (err) {
                console.error("Error fetching tasks:", err.response?.data || err.message);
            }
        };
        fetchTasks(filter.sortBy, filter.order, filter.title, filter.status);
    }, [filter.sortBy, filter.order, filter.title, filter.status]);
    useEffect(() => {
        //debouncing technique
        const delaySearch = setTimeout(() => {
            setFilter((prev) => {
                return { ...prev, title: search }
            })
        }, 1000)
        return () => clearTimeout(delaySearch)

    }, [search])

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
    const handleFilter = (e) => {
        const { name, value } = e.target;
        if (name === "title") {
            return setSearch(value)
        }else{
            console.log("name : ", name, " value: ", value)
            setFilter((prev) => {
                return { ...prev, [name]: value }
            })
        }

    }

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
                <Col xs={3} md={2}>
                    <Form.Select
                        name="status"
                        value={filter.status}
                        onChange={(e) => handleFilter(e)}
                    >
                        <option value="all">All Tasks</option>
                        <option value="not_started">Not Started</option>
                        <option value="in_progress">In Progress</option>
                        <option value="waiting">Waiting</option>
                        <option value="completed">Completed</option>
                    </Form.Select>
                </Col>
                <Col xs={3} md={2}>
                    <Form.Select
                        name="sortBy"
                        value={filter.sortBy}
                        onChange={(e) => handleFilter(e)}
                    >
                        <option value="createdAt">Created At</option>
                        <option value="updatedAt">Updated At</option>
                        <option value="completedAt">Completed At</option>
                        <option value="dueDate">Due Date</option>
                        <option value="priority">Priority</option>
                        <option value="title">Title</option>
                    </Form.Select>
                </Col>
                <Col xs={3} md={2}>
                    <Form.Select
                        name="order"
                        value={filter.order}
                        onChange={(e) => handleFilter(e)}
                    >
                        <option value="desc">Descending</option>
                        <option value="asc">Ascending</option>
                    </Form.Select>
                </Col>
                <Col xs={3} md={{ span: 3, offset: 3 }}>
                    <InputGroup className="mb-3">
                        <Form.Control
                            name="title"
                            value={search}
                            type="text"
                            placeholder="Search For Tasks"
                            onChange={(e) => handleFilter(e)}
                        />
                    </InputGroup>
                </Col>
            </Row>


            <Row >
                <Col>
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
                                        <td>
                                            {task.description}
                                        </td>
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
                                        <td className="text-center text-nowrap">
                                            <div className="btn-group btn-group-sm" role="group">
                                                <Button
                                                    variant="outline-success"
                                                    onClick={() => markComplete(task._id)}
                                                    title="Mark complete"
                                                >
                                                    <CheckCircle size={16} />
                                                </Button>

                                                <Button
                                                    variant="outline-primary"
                                                    onClick={() => handleEditTask(task._id)}
                                                    title="Edit"
                                                >
                                                    <PencilSquare size={16} />
                                                </Button>

                                                <Button
                                                    variant="outline-danger"
                                                    onClick={() => markDelete(task._id)}
                                                    title="Delete"
                                                >
                                                    <Trash size={16} />
                                                </Button>

                                                <Button
                                                    as={Link}
                                                    to={`/tasks/${task._id}`}
                                                    variant="outline-secondary"
                                                    title="Details"
                                                >
                                                    <InfoCircle size={16} />
                                                </Button>
                                            </div>
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
