import React, { useEffect, useState, useCallback } from "react";

import { Row, Container, Spinner, Alert } from "react-bootstrap";

import {
    DndContext,
    useDraggable,
    useDroppable,
    pointerWithin
} from "@dnd-kit/core";
import {
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
    arrayMove,
    sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";



import { fetchTasks } from "../../api/tasksApi";

import "./Dashboard.css";

import CompletionTrend from "./widgets/CompletionTrend";
import StatusBreakdown from "./widgets/StatusBreakdown";
import Deadlines from "./widgets/Deadlines";
import Activities from "./widgets/Activities";
import TaskSummary from "./widgets/TaskSummary";

//COMPONENTS
import SortableWidget from "./components/SortableWidget";

const STATUS_KEYS = ["not_started", "waiting", "in_progress", "completed"];
const WIDGETS = {
    summary: TaskSummary,
    trend: CompletionTrend,
    status: StatusBreakdown,
    deadlines: Deadlines,
    activity: Activities,
};
const Dashboard = () => {
    const [tasks, setTasks] = useState({
        not_started: [],
        waiting: [],
        in_progress: [],
        completed: [],
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [widgets, setWidgets] = useState([
        { title: "My Tasks Summary", id: "summary", size: 4 },
        { title: "Completion Trend", id: "trend", size: 4 },
        { title: "Status Breakdown", id: "status", size: 4 },
        { title: "Recent Activity", id: "activity", size: 4 },
        { title: "Upcoming Deadlines", id: "deadlines", size: 4 },
    ]);

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

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        setWidgets((items) => {
            const oldIndex = items.findIndex(i => i.id === active.id);
            const newIndex = items.findIndex(i => i.id === over.id);
            const updated = arrayMove(items, oldIndex, newIndex);
            localStorage.setItem("dashboardLayout", JSON.stringify(updated));
            return updated;
        });
    };
    const handleResize = (id, newSize) => {
        setWidgets((prev) =>
            prev.map((w) => (w.id === id ? { ...w, size: newSize } : w))
        );

        // Persist immediately
        localStorage.setItem(
            "dashboardLayout",
            JSON.stringify(
                widgets.map((w) =>
                    w.id === id ? { ...w, size: newSize } : w
                )
            )
        );
    };
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
            <DndContext onDragEnd={handleDragEnd}>
                <SortableContext items={widgets.map((widget) => widget.id)}>
                    <Row>
                        {widgets.map(({ title, id, size }) => {
                            const WidgetComponent = WIDGETS[id];
                            return (
                                <SortableWidget title={title} key={id} id={id} size={size} onResize={handleResize}>
                                    <WidgetComponent data={tasks} />
                                </SortableWidget>
                            );
                        })}

                    </Row>

                </SortableContext>
            </DndContext>
            {/* <Row>
                <TaskSummary data={tasks} />
                <CompletionTrend data={tasks.completed || []} />
                <StatusBreakdown data={tasks} />
                <Deadlines data={[...tasks.waiting, ...tasks.in_progress]} />
                <Activities data={[...tasks.completed, ...tasks.in_progress]} />
            </Row> */}
        </Container>
    );
};

export default Dashboard;
