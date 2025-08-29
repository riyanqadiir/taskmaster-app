import { Container } from "react-bootstrap";
import Footer from "../layout/Footer";

export default function PublicLayout({ children }) {
    return (
        <div className="d-flex flex-column min-vh-100 bg-body-tertiary">
            <main className="flex-grow-1 d-flex align-items-center justify-content-center py-5">
                <Container className="d-flex justify-content-center">
                    <div className="auth w-100">{children}</div>
                </Container>
            </main>
            <Footer />
        </div>
    );
}
