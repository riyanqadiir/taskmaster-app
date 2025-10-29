import { useState, useEffect } from "react";
import Offcanvas from "react-bootstrap/Offcanvas";
import Button from "react-bootstrap/Button";

import TaskSummary from "../widgets/TaskSummary";
import CompletionTrend from "../widgets/CompletionTrend";
import StatusBreakdown from "../widgets/StatusBreakdown";
import Deadlines from "../widgets/Deadlines";
import Activities from "../widgets/Activities";

const WIDGETS = {
    summary: TaskSummary,
    trend: CompletionTrend,
    status: StatusBreakdown,
    deadlines: Deadlines,
    activity: Activities,
};

export default function AddWidgetSidebar({ show, setShow, data, widgets, onAdd }) {
    const [availableWidgets, setAvailableWidgets] = useState([]);

    useEffect(() => {
        // 🔹 Load the base layout (from backend or localStorage)
        const storedBase = localStorage.getItem("baseLayout");
        const baseLayout = storedBase ? JSON.parse(storedBase) : [];

        // 🔹 Filter out widgets already added to the dashboard
        const filtered = baseLayout.filter(
            (base) => !widgets.some((added) => added.id === base.id)
        );

        setAvailableWidgets(filtered);
    }, [widgets, show]);

    return (
        <Offcanvas
            show={show}
            onHide={() => setShow(false)}
            placement="end"
            backdrop={false}
            scroll
            keyboard={false}
            className="add-widget-sidebar"
        >
            <Offcanvas.Header closeButton>
                <Offcanvas.Title className="mt-5">Add Widgets</Offcanvas.Title>
            </Offcanvas.Header>

            <Offcanvas.Body>
                {availableWidgets.length === 0 && (
                    <p className="text-muted small text-center">
                        All widgets are currently on your dashboard.
                    </p>
                )}

                {availableWidgets.map(({ id, title }) => {
                    const WidgetComponent = WIDGETS[id];
                    if (!WidgetComponent) return null;
                    return (
                        <div key={id} className="sidebar-draggable card mb-3">
                            <div className="card-body">
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <h6 className="fw-semibold mb-0">{title}</h6>
                                    <Button
                                        size="sm"
                                        variant="outline-primary"
                                        onClick={() => onAdd(id, title)}
                                    >
                                        Add
                                    </Button>
                                </div>

                                <div className="widget-preview">
                                    <WidgetComponent data={data} />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </Offcanvas.Body>
        </Offcanvas>
    );
}