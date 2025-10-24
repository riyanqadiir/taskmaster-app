import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Col } from "react-bootstrap";

import WidgetHeader from "./WidgetHeader";
const SortableWidget = ({  id, size, title, onResize, children }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <Col lg={size} ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <div className="card shadow-sm mb-3">
                <div className="card-body">
                    <WidgetHeader title={title} size={size} onResize={(newSize) => onResize(id, newSize)} />
                    {children}
                </div>
            </div>
        </Col>
    );
};

export default SortableWidget;