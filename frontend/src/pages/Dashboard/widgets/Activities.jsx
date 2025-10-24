import React, { useMemo, useState } from 'react';
import { Col, Button } from "react-bootstrap";

function Activities({ data }) {
    const defaultData = data || { completed: [], in_progress: [] };

    const activityData = [...defaultData.completed, ...defaultData.in_progress];
    const [showAll, setShowAll] = useState(false);

    // Transform incoming tasks into activity objects
    const activities = useMemo(() => {
        return activityData.map(task => {
            let type, message, timestamp;

            if (task.status === "completed") {
                type = "completed";
                message = `Task “${task.title}” completed`;
                timestamp = task.completedAt || task.updatedAt;
            } else if (task.status === "in_progress") {
                type = "updated";
                message = `Task “${task.title}” updated`;
                timestamp = task.updatedAt;
            } else {
                type = "info";
                message = `Task “${task.title}” activity recorded`;
                timestamp = task.updatedAt || task.createdAt;
            }

            return { type, message, timestamp };
        }).filter(a => a.timestamp); // ignore ones with no time
    }, [data]);

    // Sort by most recent
    const sortedActivities = useMemo(() => {
        return [...activities].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    }, [activities]);

    const visibleActivities = showAll ? sortedActivities : sortedActivities.slice(0, 5);

    const getIcon = (type) => {
        switch (type) {
            case "completed": return <i className="bi bi-check-circle text-success me-2"></i>;
            case "updated": return <i className="bi bi-pencil-square text-warning me-2"></i>;
            default: return <i className="bi bi-info-circle text-muted me-2"></i>;
        }
    };

    return (
        <>
            {sortedActivities.length > 0 ? (
                <>
                    <ul className="list-group list-group-flush">
                        {visibleActivities.map((activity, index) => (
                            <li key={index} className="list-group-item d-flex align-items-start">
                                {getIcon(activity.type)}
                                <div>
                                    <div>{activity.message}</div>
                                    <small className="text-muted">
                                        {new Date(activity.timestamp).toLocaleString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </small>
                                </div>
                            </li>
                        ))}
                    </ul>

                    {sortedActivities.length > 5 && (
                        <div className="text-center mt-2">
                            <Button
                                variant="link"
                                size="sm"
                                onClick={() => setShowAll(!showAll)}
                                onMouseDown={(e) => e.stopPropagation()}
                                onPointerDown={(e) => e.stopPropagation()}
                            >
                                {showAll ? "Show Less ▲" : "Show More ▼"}
                            </Button>
                        </div>
                    )}
                </>
            ) : (
                <div className="text-center text-muted py-3">
                    No recent activity yet 💤
                </div>
            )}</>
    );
}

export default Activities;
