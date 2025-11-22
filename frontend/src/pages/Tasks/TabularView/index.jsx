// src/pages/Tasks/components/TabularView.jsx
import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Row, Col, Button } from "react-bootstrap";
import {
    fetchTasks as fetchTasksApi,
    fetchDeletedTasks,
    fetchArchiveTasks,
    updateTask,
    deleteToggle,
    archiveToggle,
    hardDelete,
} from "../../../api/tasksApi";
import TaskModal from "../TaskModal";
import PaginationSection from "./PaginationSection";
import FilterTasks from "../FilterTasks";
import TaskTable from "./TaskTable";
import { useTaskContext } from "../../../context/TaskContext";

function TabularView(props) {
    const { showModal, setShowModal, mode, setMode } = props;
    const location = useLocation();
    const navigate = useNavigate();

    const { addTaskToGroups, updateTaskInGroups } = useTaskContext();

    const [tasks, setTasks] = useState([]);
    const [filter, setFilter] = useState({
        sortBy: "createdAt",
        order: "desc",
        title: "",
        status: "all",
        page: 1,
        limit: 10,
    });
    const [pagination, setPagination] = useState({
        totalItems: 0,
        currentPage: 1,
        totalPages: 0,
        pageSize: 10,
        hasNextPage: false,
        hasPrevPage: false,
    });

    const [initialValues, setInitialValues] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [refresh, setRefresh] = useState(false);

    useEffect(() => {
        let ignore = false;

        const fetchData = async (pathname) => {
            setLoading(true);
            setError(null);

            try {
                let response;
                if (pathname === "/tasks") {
                    response = await fetchTasksApi(filter);
                } else if (pathname === "/tasks/deleted") {
                    response = await fetchDeletedTasks(filter);
                } else {
                    response = await fetchArchiveTasks(filter);
                }

                const { data } = response;
                if (ignore) return;

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

        fetchData(window.location.pathname);

        return () => {
            ignore = true;
        };
    }, [filter, window.location.pathname, refresh]);

    const handleEditOpen = useCallback(
        (task) => {
            setMode("edit");
            setShowModal(true);
            setInitialValues({
                _id: task._id,
                title: task.title,
                description: task.description ?? "",
                status: task.status,
                priority: task.priority,
                dueDate: task.dueDate ? task.dueDate.split("T")[0] : "",
            });
        },
        [setMode, setShowModal]
    );

    const handleSoftDeleteToggle = useCallback(async (id, deleted) => {
        try {
            await deleteToggle(id, { deleted: !deleted });
            setRefresh((prev) => !prev);
        } catch (err) {
            console.error("Delete failed:", err.response?.data || err.message);
        }
    }, []);

    const handleHardDelete = useCallback(async (id) => {
        try {
            if (!window.confirm("Delete this task permanently?")) {
                return;
            }
            await hardDelete(id);
            setTasks((prev) => prev.filter((t) => t._id !== id));
        } catch (err) {
            console.error("Delete failed:", err.response?.data || err.message);
        }
    }, []);

    const handleDetails = useCallback(
        (id) => {
            navigate(`/tasks/${id}`, { state: { from: location.pathname } });
        },
        [navigate, location.pathname]
    );

    const handleComplete = useCallback(async (id) => {
        try {
            const res = await updateTask(id, { status: "completed" });
            const updated = res.data.task;
            setTasks((prev) =>
                prev.map((t) => (t._id === id ? updated : t))
            );

            // keep Kanban in sync for main tasks page
            if (location.pathname === "/tasks") {
                updateTaskInGroups(updated);
            }
        } catch (err) {
            console.error("Complete failed:", err.response?.data || err.message);
        }
    }, [location.pathname, updateTaskInGroups]);

    const handleArchive = useCallback(async (id, archive) => {
        try {
            await archiveToggle(id, { archive: !archive });
            setRefresh((prev) => !prev);
        } catch (err) {
            console.error(
                `${archive ? "Un Archive" : "Archive"} failed:`,
                err.response?.data || err.message
            );
        }
    }, []);

    return (
        <>
            <Row className="g-3 align-items-end mb-5">
                <FilterTasks filter={filter} setFilter={setFilter} />
            </Row>

            <Row>
                <Col xs={12}>
                    {error && (
                        <div className="text-danger text-center mb-3">
                            {error}{" "}
                            <Button onClick={() => setFilter({ ...filter })}>
                                Retry
                            </Button>
                        </div>
                    )}
                    {loading ? (
                        <div className="text-center my-4">Loading...</div>
                    ) : (
                        <TaskTable
                            tasks={tasks}
                            onEdit={handleEditOpen}
                            onComplete={handleComplete}
                            onSoftDeleteToggle={handleSoftDeleteToggle}
                            onHardDelete={handleHardDelete}
                            onDetails={handleDetails}
                            onArchiveToggle={handleArchive}
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

            <TaskModal
                show={showModal}
                handleClose={() => setShowModal(false)}
                onTaskCreated={(newTask) => {
                    // update tabular list
                    setTasks((prev) => [...prev, newTask]);

                    // also sync Kanban/global when on /tasks
                    if (location.pathname === "/tasks") {
                        addTaskToGroups(newTask);
                    }
                }}
                onTaskUpdated={(updatedTask) => {
                    // update tabular list
                    setTasks((prev) =>
                        prev.map((t) =>
                            t._id === updatedTask._id ? updatedTask : t
                        )
                    );

                    // also sync Kanban/global when on /tasks
                    if (location.pathname === "/tasks") {
                        updateTaskInGroups(updatedTask);
                    }
                }}
                mode={mode}
                initialValues={initialValues}
            />
        </>
    );
}

export default TabularView;
