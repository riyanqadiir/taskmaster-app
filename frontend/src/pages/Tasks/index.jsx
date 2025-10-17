import React, { useEffect, useState, useCallback } from "react";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import { useLocation } from "react-router-dom"; // 👈 import this

import TabularView from "./TabularView";
import Dashboard from "../Dashboard";
import { useTaskContext } from "../../context/TaskContext";
import "./Task.css";

function Tasks() {
    const { showModal, setShowModal, mode, setMode } = useTaskContext();
    const [viewMode, setViewMode] = useState("tabular");
    const location = useLocation();

    // Determine the page type based on path
    const isDeletedPage = location.pathname.includes("/deleted");
    const isArchivedPage = location.pathname.includes("/archive");

    // Heading changes dynamically
    const heading = isDeletedPage
        ? "Deleted Tasks"
        : isArchivedPage
            ? "Archived Tasks"
            : "My Tasks";

    const handleView = (e) => {
        const { value } = e.target;
        setViewMode(value);
    };

    const handleAddTask = () => {
        setMode("add");
        setShowModal(true);
    };
    useEffect(() => {
        setViewMode("tabular");
    }, [location.pathname]);
    return (
        <Container fluid className="py-4">
            <Row className="align-items-center mb-4 justify-content-between">
                <Col xs={12} sm={6}>
                    <Form.Group
                        controlId="taskView"
                        className="d-flex align-items-center flex-wrap gap-3 mb=3"
                    >
                        <Form.Label className="mb-0 fw-bold flex-shrink-0">
                            <h2 className="fw-bold mb-0">{heading}</h2>
                        </Form.Label>

                        {/* Hide view toggle for deleted or archived pages */}
                        {!isDeletedPage && !isArchivedPage && (
                            <Form.Select
                                name="view"
                                value={viewMode}
                                onChange={handleView}
                                className="form-select-sm flex-shrink-0 w-50"
                            >
                                <option value="tabular">Tabular View</option>
                                <option value="kanban">Kanban Board</option>
                            </Form.Select>
                        )}
                    </Form.Group>
                </Col>

                {/* Hide Add Task button on deleted or archived pages */}
                {!isDeletedPage && !isArchivedPage && (
                    <Col xs={12} sm={6} className="text-end mt-3 mt-sm-0">
                        <Button variant="primary" onClick={handleAddTask}>
                            Add Task
                        </Button>
                    </Col>
                )}
            </Row>

            {viewMode === "tabular" ? (
                <TabularView
                    showModal={showModal}
                    setShowModal={setShowModal}
                    mode={mode}
                    setMode={setMode}
                />
            ) : (
                <Dashboard />
            )}
        </Container>
    );
}

export default Tasks;
