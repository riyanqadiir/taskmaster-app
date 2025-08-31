// Header.jsx
import { useLayoutEffect, useRef } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import { Link } from "react-router-dom";
import LogoutButton from "../authentication/LogoutButton";

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
        <Navbar ref={ref} className="bg-body-tertiary">
            <Container className="d-flex justify-content-between align-items-center">
                <Navbar.Brand as={Link} to="/">Task Master</Navbar.Brand>
                <div className="d-flex align-items-center">
                    <Button
                        variant="outline-secondary"
                        className="d-lg-none me-2"
                        onClick={onMenuClick}
                        aria-label="Open sidebar"
                    >
                        Menu
                    </Button>
                    <LogoutButton />
                </div>
            </Container>
        </Navbar>
    );
}

export default Header;
