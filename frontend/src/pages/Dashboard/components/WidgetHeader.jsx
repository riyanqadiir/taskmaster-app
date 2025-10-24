import React from "react";
import { Button } from "react-bootstrap";
import { ArrowsAngleExpand, ArrowsFullscreen, ArrowsCollapse, X } from "react-bootstrap-icons";

/**
 * WidgetHeader
 * ------------------------------
 * - Displays the widget title and optional action buttons.
 * - Includes expand/collapse control.
 *
 * Props:
 *  • title: string               → Widget title text
 *  • size: number                → Current Bootstrap col size (4 | 8 | 12)
 *  • onResize: (newSize) => void → Callback to update size in parent
 *  • onRemove?: () => void       → Optional remove handler (future use)
 */
const WidgetHeader = ({ title, size, onResize, onRemove }) => {
    const handleResize = () => {
        // Cycle between 4 (1/3 row), 8 (2/3 row), and 12 (full row)
        const newSize = size === 4 ? 8 : size === 8 ? 12 : 4;
        onResize(newSize);
    };

    return (
        <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3">
            <h6 className="mb-0 fw-semibold">{title}</h6>

            <div className="d-flex align-items-center gap-2">
                {/* Expand / Collapse button */}
                <Button
                    variant="outline-secondary"
                    size="sm"
                    className="d-flex align-items-center"
                    onClick={handleResize}
                    onMouseDown={(e) => e.stopPropagation()}
                    onPointerDown={(e) => e.stopPropagation()}
                >
                    {size === 4 ? (
                        <ArrowsAngleExpand size={16} />
                    ) : size === 8 ? (
                        <ArrowsFullscreen size={16} />
                    ) : (
                        <ArrowsCollapse size={16} />
                    )}
                </Button>

                {/* Optional remove button (for future use) */}
                {onRemove && (
                    <Button
                        variant="outline-danger"
                        size="sm"
                        className="d-flex align-items-center"
                        onClick={onRemove}
                        onMouseDown={(e) => e.stopPropagation()}
                        onPointerDown={(e) => e.stopPropagation()}
                    >
                        <X size={14} />
                    </Button>
                )}
            </div>
        </div>
    );
};

export default WidgetHeader;