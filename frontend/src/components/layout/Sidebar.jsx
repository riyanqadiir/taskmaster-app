// Sidebar.jsx
import { Nav, Offcanvas } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Sidebar({ show, onHide }) {
    const { pathname } = useLocation();
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 992);
        check();
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);

    useEffect(() => {
        if (isMobile && show) onHide?.();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname]);

    const navItems = [
        { to: "/dashboard", label: "Dashboard" },
        { to: "/tasks", label: "Tasks" },
        { to: "/profile", label: "Profile" },
    ];

    return (
        <>
            {/* Desktop sidebar — width is given by the grid column */}
            <aside className="sidebar d-none d-lg-block">
                <div className="sidebar-inner">
                    <div className="sidebar-title">Navigation</div>
                    <Nav className="flex-column" activeKey={pathname} variant="pills">
                        {navItems.map(n => (
                            <Nav.Link key={n.to} as={Link} to={n.to} eventKey={n.to} className="nav-item-link">
                                {n.label}
                            </Nav.Link>
                        ))}
                    </Nav>
                </div>
            </aside>

            {/* Mobile menu */}
            <Offcanvas show={isMobile && show} onHide={onHide} placement="start" className="d-lg-none" backdrop scroll={false}>
                <Offcanvas.Header closeButton><Offcanvas.Title>Menu</Offcanvas.Title></Offcanvas.Header>
                <Offcanvas.Body>
                    <Nav className="flex-column" activeKey={pathname} onSelect={onHide}>
                        {navItems.map(n => (
                            <Nav.Link key={n.to} as={Link} to={n.to} eventKey={n.to} className="px-2 py-2">
                                {n.label}
                            </Nav.Link>
                        ))}
                    </Nav>
                </Offcanvas.Body>
            </Offcanvas>
        </>
    );
}
