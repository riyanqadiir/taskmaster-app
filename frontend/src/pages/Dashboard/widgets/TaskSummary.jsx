import React from 'react'
import { Col } from "react-bootstrap";
function TaskSummary({ data }) {
    return (
                <div className="d-flex justify-content-between text-center align-items-center">
                    <div>
                        <h5 className="fw-bold text-danger p-0">
                            {data.not_started.length || 0}
                        </h5>
                        <small>Not Started</small>
                    </div>
                    <div>
                        <h5 className="fw-bold text-warning">{data.waiting.length || 0}</h5>
                        <small>Waiting</small>
                    </div>
                    <div>
                        <h5 className="fw-bold text-info">{data.in_progress.length || 0}</h5>
                        <small>In Progress</small>
                    </div>
                    <div>
                        <h5 className="fw-bold text-success">{data.completed.length || 0}</h5>
                        <small>Completed</small>
                    </div>
                </div>
    )
}

export default TaskSummary