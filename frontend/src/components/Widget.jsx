import React from "react";

const Widget = ({ title, children }) => {
    return (
        <div className="card shadow-sm mb-4">
            <div className="card-header d-flex justify-content-between align-items-center">
                <h6 className="mb-0">{title}</h6>
                <button className="btn btn-sm btn-outline-secondary" title="Settings">
                    <i className="bi bi-three-dots"></i>
                </button>
            </div>
            <div className="card-body">{children}</div>
        </div>
    );
};

export default Widget;
