import React, { useEffect, useState, useCallback, useRef } from "react";
import { Row, Col, Container, Spinner, Alert, Button } from "react-bootstrap";
import {
    DndContext,
    DragOverlay,
    PointerSensor,
    useSensor,
    useSensors,
    useDroppable,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";

import { fetchTasks } from "../../api/tasksApi";
import { updateDashboardLayout } from "../../api/tasksApi"
import "./Dashboard.css";

import CompletionTrend from "./widgets/CompletionTrend";
import StatusBreakdown from "./widgets/StatusBreakdown";
import Deadlines from "./widgets/Deadlines";
import Activities from "./widgets/Activities";
import TaskSummary from "./widgets/TaskSummary";

import SortableWidget from "./components/SortableWidget";
import AddWidgetSidebar from "./components/AddWidgetSidebar";

const STATUS_KEYS = ["not_started", "waiting", "in_progress", "completed"];
const WIDGETS = {
    summary: TaskSummary,
    trend: CompletionTrend,
    status: StatusBreakdown,
    deadlines: Deadlines,
    activity: Activities,
};

export default function Dashboard() {
    const [tasks, setTasks] = useState({
        not_started: [],
        waiting: [],
        in_progress: [],
        completed: [],
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [show, setShow] = useState(false);
    const [widgets, setWidgets] = useState(() => {
        const saved = localStorage.getItem("dashboardLayout");
        return saved ? JSON.parse(saved) : [];
    });

    const [activeWidget, setActiveWidget] = useState(null);
    const [overlayStyle, setOverlayStyle] = useState({});
    const containerRef = useRef(null);

    const { setNodeRef, isOver } = useDroppable({ id: "dashboard-dropzone" });

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { delay: 100, tolerance: 5 },
        })
    );

    const loadTasks = useCallback(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const { data } = await fetchTasks({ limit: "all" });
                if (!data?.tasks) throw new Error("Invalid response format");

                const grouped = data.tasks.reduce(
                    (acc, t) => {
                        if (t.completedAt) {
                            const [datePart] = t.completedAt.split("T");
                            t.completedAt = datePart || "";
                        }
                        const key = STATUS_KEYS.includes(t.status)
                            ? t.status
                            : "not_started";
                        acc[key].push(t);
                        return acc;
                    },
                    { not_started: [], waiting: [], in_progress: [], completed: [] }
                );
                setTasks(grouped);
            } catch (err) {
                setError(err.message || "Failed to load tasks");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    useEffect(() => loadTasks(), [loadTasks]);

    const handleDragStart = (event) => {
        const comp = event.active.data?.current;
        setActiveWidget(comp);

        // Capture original dimensions for smoother overlay scaling
        const element = event.active?.node?.current;
        if (element) {
            const rect = element.getBoundingClientRect();
            setOverlayStyle({ width: rect.width, height: rect.height });
        }
    };

    const handleAddWidget = (id, title) => {
        const exists = widgets.find((w) => w.id === id);
        if (!exists) {
            const newWidget = { id, title, size: 4 };
            const updated = [...widgets, newWidget];
            setWidgets(updated);
            localStorage.setItem("dashboardLayout", JSON.stringify(updated));
        }
    };
    const handleDragEnd = async (event) => {
        const { active, over } = event;
        setActiveWidget(null);
        setOverlayStyle({});
        if (!over) return;

        // Reorder existing widgets
        if (
            widgets.some((w) => w.id === active.id) &&
            widgets.some((w) => w.id === over.id)
        ) {
            const updated = arrayMove(
                widgets,
                widgets.findIndex((i) => i.id === active.id),
                widgets.findIndex((i) => i.id === over.id)
            );

            setWidgets(updated);
            localStorage.setItem("dashboardLayout", JSON.stringify(updated));

            // ✅ Sync with backend
            try {
                await updateDashboardLayout(updated);
            } catch (err) {
                console.error("Failed to update dashboard layout:", err);
            }

            return;
        }

        // Add new widget
        if (over.id === "dashboard-dropzone") {
            const exists = widgets.find((w) => w.id === active.id);
            if (!exists) {
                const newWidget = {
                    id: active.id,
                    title: active.data.current?.title,
                    size: 4,
                };
                const updated = [...widgets, newWidget];
                setWidgets(updated);
                localStorage.setItem("dashboardLayout", JSON.stringify(updated));

                // ✅ Sync with backend
                try {
                    await updateDashboardLayout(updated);
                } catch (err) {
                    console.error("Failed to save new widget layout:", err);
                }
            }
        }
    };

    const handleRemoveWidget = async (id) => {
        const updated = widgets.filter((w) => w.id !== id);
        setWidgets(updated);
        localStorage.setItem("dashboardLayout", JSON.stringify(updated));

        try {
            await updateDashboardLayout(updated);
        } catch (err) {
            console.error("Failed to update dashboard layout:", err);
        }
    };

    const handleResize = async (id, newSize) => {
        const updated = widgets.map((w) =>
            w.id === id ? { ...w, size: newSize } : w
        );
        setWidgets(updated);
        localStorage.setItem("dashboardLayout", JSON.stringify(updated));

        try {
            await updateDashboardLayout(updated);
        } catch (err) {
            console.error("Failed to update dashboard layout:", err);
        }
    };

    if (loading)
        return (
            <Container fluid className="py-5 text-center">
                <Spinner animation="border" />
            </Container>
        );

    if (error)
        return (
            <Container fluid className="py-5">
                <Alert variant="danger">{error}</Alert>
            </Container>
        );

    return (
        <Container
            fluid
            className={`py-4 dashboard-container ${isOver ? "highlight-drop" : ""}`}
            ref={(node) => {
                setNodeRef(node);
                containerRef.current = node;
            }}
        >
            <DndContext
                sensors={sensors}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                <Row className="mb-4 justify-content-between align-items-center">
                    <Col>
                        <h4 className="mb-0">My Dashboard</h4>
                    </Col>
                    <Col>
                        <Button
                            variant="primary"
                            className="float-end"
                            onClick={() => setShow((p) => !p)}
                        >
                            Add Widget
                        </Button>
                        <AddWidgetSidebar
                            show={show}
                            setShow={setShow}
                            data={tasks}
                            widgets={widgets}
                            onAdd={handleAddWidget}
                        />
                    </Col>
                </Row>

                <div
                    ref={setNodeRef}
                    className={`dashboard-dropzone ${isOver ? "highlight-drop" : ""}`}
                >
                    <SortableContext items={widgets.map((w) => w.id)}>
                        <Row>
                            {widgets.map(({ id, title, size }) => {
                                const WidgetComponent = WIDGETS[id];
                                if (!WidgetComponent) return null;
                                return (
                                    <SortableWidget
                                        key={id}
                                        id={id}
                                        size={size}
                                        title={title}
                                        onResize={handleResize}
                                        onRemove={() => handleRemoveWidget(id)}
                                    >
                                        <WidgetComponent data={tasks} />
                                    </SortableWidget>
                                );
                            })}
                        </Row>
                    </SortableContext>
                </div>

                <DragOverlay
                    style={overlayStyle}
                    adjustScale={false}
                    dropAnimation={{
                        duration: 200,
                        easing: "cubic-bezier(0.25, 1, 0.5, 1)",
                    }}
                >
                    {activeWidget?.component ? (
                        <div className="drag-overlay-card">
                            <h6 className="fw-semibold mb-2">{activeWidget.title}</h6>
                            <activeWidget.component data={activeWidget.data} />
                        </div>
                    ) : null}
                </DragOverlay>
            </DndContext>
        </Container>
    );
}