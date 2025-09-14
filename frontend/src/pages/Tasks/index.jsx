import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Button } from "react-bootstrap";

import { fetchTasks as fetchTasksApi, updateTask, deleteTask } from "../../api/tasksApi";

import AddTaskModal from "./AddTaskModal";
import PaginationSection from "./PaginationSection";
import FilterTasks from "./FilterTasks";
import TaskTable from "./TaskTable";
import "./Task.css";

function Tasks() {
    const navigate = useNavigate();
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
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);


    useEffect(() => {
        let ignore = false;

        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const { data } = await fetchTasksApi(filter);
                if (ignore) {
                    return;
                } // don't update if unmounted
                setTasks(data.tasks ?? []);
                setPagination(data.pagination);
            } catch (err) {
                if (!ignore) {
                    setError(err.response?.data || err.message);
                }
            } finally {
                if (!ignore) {
                    setLoading(false);
                }
            }
        };
        fetchData();

        return () => ignore = true

    }, [filter]);

    const handleEditOpen = useCallback((task) => {
        setMode("edit");
        setShowModal(true);
        setInitialValues({
            _id: task._id,
            title: task.title,
            description: task.description ?? "",
            status: task.status,
            priority: task.priority,
            dueDate: task.dueDate ? task.dueDate.split("T")[0] : ""
        });
    }, [])
    const handleDelete = useCallback(async (id) => {
        try {
            if (!window.confirm("Delete this task?")) {
                return;
            }
            await deleteTask(id);
            setTasks(prev => prev.filter(t => t._id !== id));
        } catch (err) {
            console.error("Delete failed:", err.response?.data || err.message);
        }
    }, [])

    const handleDetails = useCallback((id) => {
        navigate(`/tasks/${id}`);
    }, [])
    const handleComplete = useCallback(async (id) => {
        try {
            const res = await updateTask(id, { status: "completed" });
            setTasks(prev => prev.map(t => (t._id === id ? res.data.task : t)));
        } catch (err) {
            console.error("Complete failed:", err.response?.data || err.message);
        }
    }, [])

    const handleAddTask = () => {
        setMode("add")
        setShowModal(true)
    }


    return (
        <Container fluid className="py-4">
            <Row className="align-items-center mb-4">
                <Col>
                    <h2 className="fw-bold">My Tasks</h2>
                </Col>
                <Col xs="auto">
                    <Button variant="primary" onClick={() => handleAddTask()}>Add Task</Button>
                </Col>
            </Row>

            <Row className="g-3 align-items-end mb-5">
                <FilterTasks filter={filter} setFilter={setFilter} />
            </Row>

            <Row>
                <Col xs={12}>
                    {error && (
                        <div className="text-danger text-center mb-3">
                            {error} <Button onClick={() => setFilter({ ...filter })}>Retry</Button>
                        </div>
                    )}
                    {loading ? (
                        <div className="text-center my-4">Loading...</div>
                    ) : (
                        <TaskTable
                            tasks={tasks}
                            onEdit={handleEditOpen}
                            onComplete={handleComplete}
                            onDelete={handleDelete}
                            onDetails={handleDetails}
                        />
                    )}
                </Col>
                <Col
                    xs={12}
                    className="d-flex justify-content-between align-items-stretch"
                >
                    <PaginationSection
                        pagination={pagination}
                        setFilter={setFilter}
                        filter={filter}
                    />
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
