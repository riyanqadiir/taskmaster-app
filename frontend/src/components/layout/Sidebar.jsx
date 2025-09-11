// Sidebar.jsx
import { Nav, Offcanvas } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Sidebar({ show, onHide, width = 240 }) {
    const { pathname } = useLocation();
    const [isMobile, setIsMobile] = useState(false);

    // Check if screen is mobile size
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 992); // Bootstrap lg breakpoint
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const navItems = [
        { to: "/", label: "Dashboard" },
        { to: "/tasks", label: "Tasks" },
        { to: "/profile", label: "Profile" },
    ];

    return (
        <>
            {/* Desktop sidebar (lg and up) - now toggleable */}
            <aside
                className="d-none d-lg-block bg-light border-end position-sticky"
                style={{
                    width: show ? width : 0,
                    top: 0,
                    height: "calc(100vh - 144px)",
                    overflow: "hidden",
                    transition: "width 0.3s ease"
                }}
            >
                <div className="p-3 fw-semibold" style={{ width: width }}>Navigation</div>
                <Nav className="flex-column" activeKey={pathname} variant="pills" style={{ width: width }}>
                    {navItems.map(n => (
                        <Nav.Link
                            key={n.to}
                            as={Link}
                            to={n.to}
                            eventKey={n.to}
                            className="px-3 py-2"
                        >
                            {n.label}
                        </Nav.Link>
                    ))}
                </Nav>
            </aside>

            {/* Mobile Offcanvas (below lg) */}
            <Offcanvas show={isMobile && show} onHide={onHide} placement="start" className="d-lg-none">
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Menu</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Nav className="flex-column" activeKey={pathname} onSelect={onHide}>
                        {navItems.map(n => (
                            <Nav.Link
                                key={n.to}
                                as={Link}
                                to={n.to}
                                eventKey={n.to}
                                className="px-2 py-2"
                            >
                                {n.label}
                            </Nav.Link>
                        ))}
                    </Nav>
                </Offcanvas.Body>
            </Offcanvas>
        </>
    );
}