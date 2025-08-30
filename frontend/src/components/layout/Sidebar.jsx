// Sidebar.jsx
import { Nav, Offcanvas } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar({ show, onHide, width = 240 }) {
    const { pathname } = useLocation();

    const navItems = [
        { to: "/", label: "Dashboard" },
        { to: "/tasks", label: "Tasks" },
        { to: "/profile", label: "Profile" },
    ];

    return (
        <>
            {/* Desktop sidebar (lg and up) */}
            <aside
                className="d-none d-lg-block bg-light border-end position-sticky"
                style={{
                    width,
                    top: 0,
                    // 56px ~= default Bootstrap navbar height; tweak if needed
                    height: "calc(100vh - 168px)",
                }}
            >
                <div className="p-3 fw-semibold">Navigation</div>
                <Nav className="flex-column" activeKey={pathname} variant="pills">
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
            <Offcanvas show={show} onHide={onHide} placement="start" className="d-lg-none">
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
