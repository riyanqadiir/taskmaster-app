import React from "react";
import { Col } from "react-bootstrap";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import WidgetHeader from "./WidgetHeader";

export default function SortableWidget({ id, size, title, onResize,onRemove, children }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
        useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.6 : 1,
    };

    return (
        <Col lg={size} md={6} sm={12} ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <div className="card shadow-sm mb-3">
                <div className="card-body widget-card-body">
                    <WidgetHeader
                        title={title}
                        size={size}
                        onResize={(newSize) => onResize(id, newSize)}
                        onRemove={onRemove}
                    />
                    {children}
                </div>
            </div>
        </Col>
    );
}