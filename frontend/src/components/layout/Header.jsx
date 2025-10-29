// Header.jsx
import { useLayoutEffect, useRef } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import { Link } from "react-router-dom";
import LogoutButton from "../common/LogoutButton";
import ThemeToggle from "../common/ThemeToggle";

function Header({ onMenuClick }) {
    const ref = useRef(null);

    // Measure header height and expose as CSS var: --header-h
    useLayoutEffect(() => {
        const setVar = () => {
            const h = ref.current?.offsetHeight || 56;
            document.documentElement.style.setProperty("--header-h", `${h}px`);
        };
        setVar();
        window.addEventListener("resize", setVar);
        return () => window.removeEventListener("resize", setVar);
    }, []);

    return (
        <Navbar ref={ref} expand="lg" className="app-header">
            <Container fluid className="d-flex justify-content-between align-items-center header-content">
                <div className="d-flex align-items-center">
                    <Button
                        variant="outline-secondary"
                        className="me-2 border-0"
                        onClick={onMenuClick}
                        aria-label="Toggle sidebar"
                        style={{ padding: '0.25rem 0.5rem' }}
                    >
                        <svg
                            width="20"
                            height="20"
                            fill="currentColor"
                            viewBox="0 0 16 16"
                        >
                            <path fillRule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z" />
                        </svg>
                    </Button>
                    <Navbar.Brand as={Link} to="/">Task Master</Navbar.Brand>
                </div>
                <div className="d-flex align-items-center header-actions">
                    <ThemeToggle />
                    <LogoutButton className="ms-3" />
                </div>
            </Container>
        </Navbar>
    );
}

export default Header;