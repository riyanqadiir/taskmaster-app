import React, { useEffect, useState, useCallback } from "react";
import Widget from "../../components/Widget";
import "./Dashboard.css";
import { Row, Col, Container, Spinner, Alert } from "react-bootstrap";
import CompletionTrend from "./CompletionTrend";
import StatusBreakdown from "./StatusBreakdown";
import Deadlines from "./Deadlines";
import Activities from "./Activities";
import { fetchTasks } from "../../api/tasksApi";

const STATUS_KEYS = ["not_started", "waiting", "in_progress", "completed"];

const Dashboard = () => {
    const [tasks, setTasks] = useState({
        not_started: [],
        waiting: [],
        in_progress: [],
        completed: [],
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const loadTasks = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            const { data } = await fetchTasks({ limit: "all" });
            if (!data?.tasks) throw new Error("Invalid response format");

            const grouped = data.tasks.reduce(
                (acc, t) => {
                    
                    if (t.completedAt) {
                        try {
                            const [datePart] = t.completedAt.split("T");
                            t.completedAt = datePart.replace("/", "-");
                        } catch {
                            t.completedAt = "";
                        }
                    }

                    const key = STATUS_KEYS.includes(t.status) ? t.status : "not_started";
                    acc[key].push(t);
                    return acc;
                },
                { not_started: [], waiting: [], in_progress: [], completed: [] }
            );

            setTasks(grouped);
            console.log("Grouped tasks:", grouped);
        } catch (err) {
            console.error("Error loading tasks:", err);
            setError(err.message || "Failed to load tasks");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadTasks();
    }, [loadTasks]);

    if (loading) {
        return (
            <Container fluid className="py-5 text-center">
                <Spinner animation="border" variant="primary" />
                <p className="mt-3 text-muted">Loading your dashboard...</p>
            </Container>
        );
    }

    if (error) {
        return (
            <Container fluid className="py-5">
                <Alert variant="danger" className="text-center">
                    <strong>Error:</strong> {error}
                    <div className="mt-3">
                        <button className="btn btn-sm btn-outline-primary" onClick={loadTasks}>
                            Retry
                        </button>
                    </div>
                </Alert>
            </Container>
        );
    }

    return (
        <Container fluid className="py-4 dashboard-container">
            <h4 className="mb-4">My Dashboard</h4>

            <Row>
                <Col md={6} lg={4}>
                    <Widget title="My Tasks Summary">
                        <div className="d-flex justify-content-between text-center align-items-center">
                            <div>
                                <h5 className="fw-bold text-danger p-0">
                                    {tasks.not_started.length || 0}
                                </h5>
                                <small>Not Started</small>
                            </div>
                            <div>
                                <h5 className="fw-bold text-warning">{tasks.waiting.length || 0}</h5>
                                <small>Waiting</small>
                            </div>
                            <div>
                                <h5 className="fw-bold text-info">{tasks.in_progress.length || 0}</h5>
                                <small>In Progress</small>
                            </div>
                            <div>
                                <h5 className="fw-bold text-success">{tasks.completed.length || 0}</h5>
                                <small>Completed</small>
                            </div>
                        </div>
                    </Widget>
                </Col>

                {/* Charts and Lists */}
                <CompletionTrend data={tasks.completed || []} />
                <StatusBreakdown data={tasks} />
                <Deadlines data={[...tasks.waiting, ...tasks.in_progress]} />
                <Activities data={[...tasks.completed, ...tasks.in_progress]} />
            </Row>
        </Container>
    );
};

export default Dashboard;
