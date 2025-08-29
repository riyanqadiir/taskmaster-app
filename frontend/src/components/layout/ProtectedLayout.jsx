// ProtectedLayout.jsx
import React, { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { Container, Row, Col } from "react-bootstrap";
import Footer from "./Footer";

export default function ProtectedLayout({ children }) {
    const [showSidebar, setShowSidebar] = useState(false);

    return (
        <>
            <div className="d-flex flex-column min-vh-100">
                <Header onMenuClick={() => setShowSidebar(true)} />
                <div className="flex-grow-1">
                    <Container fluid className="px-0">
                        <Row className="g-0">
                            <Col lg="auto" className="p-0">
                                <Sidebar
                                    show={showSidebar}
                                    onHide={() => setShowSidebar(false)}
                                    width={240}
                                />
                            </Col>
                            <Col className="p-3">
                                <main>{children}</main>
                            </Col>
                        </Row>
                    </Container>
                </div>
                <Footer />
            </div>
        </>
    );
}
