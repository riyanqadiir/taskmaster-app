import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button, Table, Badge, Form } from "react-bootstrap";
import { PencilSquare, Trash, CheckCircle, InfoCircle } from "react-bootstrap-icons";
import api from "../../api/axios"; // your axios instance
import AddTaskModal from "./AddTaskModal";
import { Link } from "react-router-dom";
import PaginationSection from "./PaginationSection";
function Tasks() {
    const [tasks, setTasks] = useState([]);
    const [filter, setFilter] = useState({
        sortBy: "createdAt",
        order: "desc",
        title: "",
        status: "all",
        page: 1,
        limit: 10
    });
    const [pagination, setPagination] = useState({
        "totalItems": 0,
        "currentPage": 1,
        "totalPages": 0,
        "pageSize": 10,
        "hasNextPage": false,
        "hasPrevPage": false
    })

    const [showModal, setShowModal] = useState(false);
    const [mode, setMode] = useState("add")
    const [initialValues, setInitialValues] = useState({})
    const [search, setSearch] = useState("")

    useEffect(() => {
        const fetchTasks = async (sortBy, order, title, status, page, limit) => {
            console.log(sortBy, order, title, status)
            try {
                const { data } = await api.get("/tasks", { params: { sortBy, order, title, status, page, limit } });
                setTasks(data.tasks || []);
                setPagination(data.pagination);
            } catch (err) {
                console.error("Error fetching tasks:", err.response?.data || err.message);
            }
        };
        fetchTasks(filter.sortBy, filter.order, filter.title, filter.status, filter.page, filter.limit);
    }, [filter.sortBy, filter.order, filter.title, filter.status, filter.page, filter.limit]);

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
        } else {
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

            <Row className="g-3 align-items-end mb-5">
                <Col xs={12} md={3}>
                    <Form.Group controlId="filterStatus">
                        <Form.Label>Status</Form.Label>
                        <Form.Select
                            name="status"
                            value={filter.status}
                            onChange={handleFilter}
                        >
                            <option value="all">All Tasks</option>
                            <option value="not_started">Not Started</option>
                            <option value="in_progress">In Progress</option>
                            <option value="waiting">Waiting</option>
                            <option value="completed">Completed</option>
                        </Form.Select>
                    </Form.Group>
                </Col>

                <Col xs={12} md={3}>
                    <Form.Group controlId="filterSortBy">
                        <Form.Label>Sort By</Form.Label>
                        <Form.Select
                            name="sortBy"
                            value={filter.sortBy}
                            onChange={handleFilter}
                        >
                            <option value="createdAt">Created At</option>
                            <option value="updatedAt">Updated At</option>
                            <option value="completedAt">Completed At</option>
                            <option value="dueDate">Due Date</option>
                            <option value="priority">Priority</option>
                            <option value="title">Title</option>
                        </Form.Select>
                    </Form.Group>
                </Col>

                <Col xs={12} md={3}>
                    <Form.Group controlId="filterOrder">
                        <Form.Label>Order</Form.Label>
                        <Form.Select
                            name="order"
                            value={filter.order}
                            onChange={handleFilter}
                        >
                            <option value="desc">Descending</option>
                            <option value="asc">Ascending</option>
                        </Form.Select>
                    </Form.Group>
                </Col>

                <Col xs={12} md={3}>
                    <Form.Group controlId="filterSearch">
                        <Form.Label>Search</Form.Label>
                        <Form.Control
                            name="title"
                            value={search}
                            type="text"
                            placeholder="Search for tasks"
                            onChange={handleFilter}
                        />
                    </Form.Group>
                </Col>
            </Row>



            <Row >
                <Col xs={12}>
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
                                    <td colSpan="6" className="text-center text-muted">
                                        No tasks found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </Col>
                <Col xs={12} className="d-flex justify-content-between align-items-stretch">
                    <PaginationSection pagination={pagination} setFilter={setFilter} filter={filter} />
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
