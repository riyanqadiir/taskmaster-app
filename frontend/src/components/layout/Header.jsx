import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from "react-router-dom";
import LogoutButton from "../authentication/LogoutButton"
function Header({ onMenuClick }) {

    return (
        <Navbar className="bg-body-tertiary">
            <Container className="d-flex justify-content-between align-items-center">
                <Navbar.Brand as={Link} to="/">Task Master</Navbar.Brand>
                <div>
                <Button
                    variant="outline-secondary"
                    className="d-lg-none me-2  "
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
