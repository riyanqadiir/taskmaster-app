import React from "react";
import { Container, Row, Col } from "react-bootstrap";

export default function Footer() {
    return (
        <footer className="bg-dark text-white py-2 ">
            <Container>
                <Row className="align-items-center justify-content-center text-center ">
                    <Col md={6}>
                        <h5 className="fw-bold">Task Master</h5>
                        <p className="mb-0">© {new Date().getFullYear()} Task Master. All rights reserved.</p>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
}
