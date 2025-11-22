import { Modal, Button, Form } from "react-bootstrap";
import { useState, useEffect } from "react";
import { createTask, updateTask } from "../../api/tasksApi";
import "./TaskModal.css";

function TaskModal({ show, handleClose, onTaskCreated, onTaskUpdated, mode, initialValues }) {
    const [validated, setValidated] = useState(false);
    const [saving, setSaving] = useState(false);
    const [dateError, setDateError] = useState("");

    const today = new Date().toISOString().split("T")[0];

    const [form, setForm] = useState({
        title: "",
        description: "",
        status: "not_started",
        priority: "Low",
        dueDate: "",
    });

    useEffect(() => {
        if (mode === "edit" && initialValues) {
            setForm(initialValues);
        }
        if (mode === "add") {
            setForm({
                title: "",
                description: "",
                status: "not_started",
                priority: "Low",
                dueDate: "",
            });
        }
        setDateError("");
        setValidated(false);
    }, [show, mode, initialValues]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Clear date error on change
        if (name === "dueDate") {
            setDateError("");
        }

        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        const formEl = e.currentTarget;
        setValidated(true);

        // Check bootstrap HTML validity
        if (formEl.checkValidity() === false) {
            return;
        }

        // Prevent past dates
        if (form.dueDate && new Date(form.dueDate) < new Date(today)) {
            setDateError("Due date must be today or later.");
            return;
        }

        setSaving(true);
        try {
            let response;

            if (mode === "edit") {
                response = await updateTask(form._id, form);
                onTaskUpdated(response.data.task);
            } else {
                response = await createTask(form);
                onTaskCreated(response.data.task);
            }
            handleClose();
        } catch (err) {
            console.error("Error creating task:", err.response?.data || err.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <Modal show={show} onHide={handleClose} className="task-modal">
            <Modal.Header closeButton>
                <Modal.Title>{mode === "edit" ? "Edit Task" : "Add Task"}</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Title</Form.Label>
                        <Form.Control
                            type="text"
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            required
                        />
                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                        <Form.Control.Feedback type="invalid">
                            Title is required!
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Status</Form.Label>
                        <Form.Select name="status" value={form.status} onChange={handleChange}>
                            <option value="not_started">Not Started</option>
                            <option value="in_progress">In Progress</option>
                            <option value="waiting">Waiting</option>
                            <option value="completed">Completed</option>
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Priority</Form.Label>
                        <Form.Select name="priority" value={form.priority} onChange={handleChange}>
                            <option value="High">High</option>
                            <option value="Medium">Medium</option>
                            <option value="Low">Low</option>
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Due Date</Form.Label>
                        <Form.Control
                            type="date"
                            name="dueDate"
                            min={today}
                            value={form.dueDate}
                            onChange={handleChange}
                            required
                            isInvalid={dateError !== ""}
                        />
                        <Form.Control.Feedback type="invalid">
                            {dateError || "Due date is required"}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Button type="submit" variant="primary" disabled={saving}>
                        {saving ? "Saving..." : "Save Task"}
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
}

export default TaskModal;
