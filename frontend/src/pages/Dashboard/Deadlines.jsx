import React, { useMemo, useState } from 'react';
import { Col, Button } from "react-bootstrap";
import Widget from '../../components/Widget';

function Deadlines({ data = [] }) {
    const [showAll, setShowAll] = useState(false);
    const now = new Date();

    
    const upcomingTasks = useMemo(() => {
        return data
            .filter(task => {
                const due = new Date(task.dueDate);
                return due >= now; 
            })
            .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate)); 
    }, [data]);
    const visibleTasks = showAll ? upcomingTasks : upcomingTasks.slice(0, 5);

    return (
        <Col md={6} lg={6}>
            <Widget title="Upcoming Deadlines">
                {upcomingTasks.length > 0 ? (
                    <>
                        <ul className="list-group list-group-flush">
                            {visibleTasks.map((task, index) => {
                                const dueDate = new Date(task.dueDate);
                                const formattedDate = dueDate.toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                });

                                return (
                                    <li
                                        key={index}
                                        className="list-group-item d-flex justify-content-between align-items-center"
                                    >
                                        <span>{task.title}</span>
                                        <small className="text-muted">{formattedDate}</small>
                                    </li>
                                );
                            })}
                        </ul>

                        {upcomingTasks.length > 5 && (
                            <div className="text-center mt-2">
                                <Button
                                    variant="link"
                                    size="sm"
                                    onClick={() => setShowAll(!showAll)}
                                >
                                    {showAll ? "Show Less ▲" : "Show More ▼"}
                                </Button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center text-muted py-3">No upcoming tasks 🎉</div>
                )}
            </Widget>
        </Col>
    );
}

export default Deadlines;
