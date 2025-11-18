// Sidebar.jsx
import { Nav, Offcanvas, Accordion } from "react-bootstrap";
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
        {
            to: "/tasks",
            label: "Current Tasks",
            sublinks: [
                { to: "/tasks/deleted", label: "Deleted Tasks" },
                { to: "/tasks/archive", label: "Archive Tasks" }
            ]
        },
        { to: "/profile", label: "Profile" },
    ];

    return (
        <>
            {/* Desktop sidebar — width is given by the grid column */}
            <aside className="sidebar d-none d-lg-block">
                <div className="sidebar-inner p-3">
                    <div className="sidebar-title">Navigation</div>
                    <Nav className="flex-column" activeKey={pathname} variant="pills">
                        {navItems.map(n => {
                            if (n.to !== "/tasks") {
                                return <Nav.Link key={n.to} as={Link} to={n.to} eventKey={n.to} className="nav-item-link">
                                    {n.label}
                                </Nav.Link>
                            }
                            else {
                                return <Accordion defaultActiveKey={n.to}  key={n.to}  alwaysOpen>
                                    <Accordion.Item eventKey={n.to}>
                                        <Accordion.Header >Tasks</Accordion.Header>
                                        <Accordion.Body className="p-0"> {/* Use `p-0` to remove padding from the body */}
                                            <Nav.Link key={n.to} as={Link} to={n.to} eventKey={n.to} className="nav-item-link">{n.label}</Nav.Link>
                                            {n.sublinks.map((sub) => {
                                                return <Nav.Link key={sub.to} as={Link} to={sub.to} eventKey={sub.to} className="nav-item-link">{sub.label}</Nav.Link>
                                            })}

                                        </Accordion.Body>
                                    </Accordion.Item>
                                </Accordion>
                            }
                        }
                        )}
                    </Nav>
                </div>
            </aside>

            {/* Mobile menu */}
            <Offcanvas show={isMobile && show} onHide={onHide} placement="start" className="d-lg-none" backdrop scroll={false}>
                <Offcanvas.Header closeButton><Offcanvas.Title>Menu</Offcanvas.Title></Offcanvas.Header>
                <Offcanvas.Body>
                    <Nav className="flex-column py-5" activeKey={pathname} onSelect={onHide}>
                        {navItems.map(n => {
                            if (n.to !== "/tasks") {
                                return <Nav.Link key={n.to} as={Link} to={n.to} eventKey={n.to} className="nav-item-link">
                                    {n.label}
                                </Nav.Link>
                            }
                            else {
                                return <Accordion defaultActiveKey={n.to} key={n.to}  alwaysOpen>
                                    <Accordion.Item eventKey={n.to}>
                                        <Accordion.Header>Tasks</Accordion.Header>
                                        <Accordion.Body className="p-0"> {/* Use `p-0` to remove padding from the body */}
                                            <Nav.Link key={n.to} as={Link} to={n.to} eventKey={n.to} className="nav-item-link">{n.label}</Nav.Link>
                                            {n.sublinks.map((sub) => {
                                                return <Nav.Link key={sub.to} as={Link} to={sub.to} eventKey={sub.to} className="nav-item-link">{sub.label}</Nav.Link>
                                            })}

                                        </Accordion.Body>
                                    </Accordion.Item>
                                </Accordion>
                            }
                        })}
                    </Nav>
                </Offcanvas.Body>
            </Offcanvas>
        </>
    );
}
