// TaskDetail.jsx
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState, useCallback } from 'react';
import { taskDetail } from '../../api/tasksApi';
import { Alert, Button } from "react-bootstrap";
import TaskCard from './TaskDetailCard';
import './TaskDetail.css';
import TaskModal from "../Tasks/TaskModal";

function TaskDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [task, setTask] = useState(null);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState("");

    const [showModal, setShowModal] = useState(false);
    const [saving, setSaving] = useState(false);
    const [saveOk, setSaveOk] = useState("");

    const [initialValues, setInitialValues] = useState({
        _id: "",
        title: "",
        description: "",
        status: "",
        priority: "",
        dueDate: "",
    });

    const load = useCallback(async (taskId, signal) => {
        try {
            setLoading(true);
            setErr("");
            const resp = await taskDetail(taskId);
            const data = resp?.data ?? resp;
            if (signal?.aborted) {
                return;
            }

            if (data?.task) {
                setTask(data.task);
            } else {
                setTask(null);
                setErr("Task not found.");
            }
        } catch (e) {
            if (signal?.aborted) {
                return;
            }
            setTask(null);
            setErr(e?.response?.data?.message || e?.message || "Failed to load task");
        } finally {
            if (!signal?.aborted) {
                setLoading(false);
            }
        }
    }, []);

    useEffect(() => {
        if (!id) { navigate("/tasks"); return; }
        const controller = new AbortController();
        load(id, controller.signal);
        return () => controller.abort();
    }, [id, navigate, load]);

    const handleEditOpen = useCallback((t) => {
        if (!t) {
            return;
        }
        setShowModal(true);
        setSaveOk("");
        setInitialValues({
            _id: t._id || "",
            title: t.title || "",
            description: t.description ?? "",
            status: t.status || "",
            priority: t.priority ?? "",
            dueDate: t.dueDate ? t.dueDate.split("T")[0] : "",
        });
    }, []);

    const handleTaskUpdated = useCallback((updatedTask) => {
        setSaving(false);
        setSaveOk("Task updated successfully.");

        if (updatedTask) {
            setTask(updatedTask);
        }

        setShowModal(false);
    }, []);

    // Convenience: retry with fresh controller
    const retryLoad = () => {
        const controller = new AbortController();
        load(id, controller.signal);
    };

    return (
        <div className="td-wrapper">
            <div className="td-header">
                <div className="td-breadcrumbs">Tasks / Detail</div>
                <div className="td-actions">
                    <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => navigate('/tasks')}
                        disabled={loading || saving}
                    >
                        Back
                    </Button>
                    {task && (
                        <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleEditOpen(task)}
                            disabled={loading || saving}
                        >
                            Edit
                        </Button>
                    )}
                </div>
            </div>

            {!loading && !err && saveOk && (
                <div style={{ width: 'min(100%, 960px)', marginBottom: 12 }}>
                    <Alert variant="success" className="mb-2">{saveOk}</Alert>
                </div>
            )}

            {loading && (
                <div className="td-skeleton" aria-label="Loading task">
                    <div className="td-skel-line lg" />
                    <div className="td-skel-line md" />
                    <div className="td-skel-line sm" />
                    <div className="td-skel-line md" />
                    <div className="td-skel-line lg" />
                </div>
            )}

            {!loading && err && (
                <div style={{ width: 'min(100%, 960px)' }}>
                    <Alert variant="danger" className="d-flex justify-content-between align-items-center">
                        <span>{err}</span>
                        <div>
                            <Button variant="outline-light" size="sm" onClick={retryLoad}>Retry</Button>{' '}
                            <Button variant="light" size="sm" onClick={() => navigate("/tasks")}>Back</Button>
                        </div>
                    </Alert>
                </div>
            )}

            {!loading && !err && task && <TaskCard task={task} />}


            <TaskModal
                show={showModal}
                handleClose={() => setShowModal(false)}
                onTaskUpdated={handleTaskUpdated}
                mode="edit"
                initialValues={initialValues}
            />
        </div>
    );
}

export default TaskDetail;
