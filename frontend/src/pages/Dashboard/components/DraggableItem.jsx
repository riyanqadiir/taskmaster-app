import React from "react";
import { useDraggable } from "@dnd-kit/core";

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

export default function DraggableItem({ id, title, data }) {
    const WidgetComponent = WIDGETS[id];
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id,
        data: {
            id,
            title,
            component: WidgetComponent,
            data,
        },
    });

    const style = transform
        ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
        : undefined;

    return (
        <div
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            style={style}
            className="sidebar-draggable card mb-3"
        >
            <div className="card-body py-2">
                <h6 className="fw-semibold mb-2">{title}</h6>
                <div className="widget-preview">
                    <WidgetComponent data={data} />
                </div>
            </div>
        </div>
    );
}