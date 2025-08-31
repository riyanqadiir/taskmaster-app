import { Modal, Button, Form } from "react-bootstrap";
import { useState, useEffect } from "react";
import api from "../../api/axios";

function AddTaskModal({ show, handleClose, onTaskCreated,onTaskUpdated, mode, initialValues }) {
    const [form, setForm] = useState({
        title: "",
        description: "",
        status: "not_started",
        priority: "Low",
        dueDate: "",
    });
    useEffect(() => {
        if (mode === "edit" && initialValues) setForm(initialValues);
        if (mode === "add") setForm({ title: "", description: "", status: "not_started", priority: "Low", dueDate: "" });
    }, [show, mode, initialValues]);
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let response;
            if (mode === "edit") {
                response = await api.patch(`/tasks/${form._id}`, form);
                onTaskUpdated(response.data.task)
                console.log(response.data.task)
            } else {
                response = await api.post("/tasks", form);
                onTaskCreated(response.data.task);
            }
            handleClose();
        } catch (err) {
            console.error("Error creating task:", err.response?.data || err.message);
        }
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Add Task</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Title</Form.Label>
                        <Form.Control
                            type="text"
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            required
                        />
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
                            value={form.dueDate}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Button type="submit" variant="primary">Save Task</Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
}

export default AddTaskModal;
