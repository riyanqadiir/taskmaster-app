// DraggableTaskCard.jsx
import { useDraggable } from "@dnd-kit/core";
import TaskCard from "./TaskCard";

export default function DraggableTaskCard({ task }) {
    const { attributes, listeners, setNodeRef, transform, isDragging } =
        useDraggable({ id: task._id });

    const style = transform
        ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
        : undefined;

    return (
        <TaskCard
            ref={setNodeRef}
            attributes={attributes}
            listeners={listeners}
            style={style}
            isDragging={isDragging}
            task={task}
        />
    );
}
