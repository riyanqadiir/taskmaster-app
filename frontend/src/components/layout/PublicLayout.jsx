import Footer from "../layout/Footer";

export default function PublicLayout({ children }) {
    return (
        <>
            <main>
                <div className="auth">{children}</div>
            </main>
            <Footer />
        </>
    );
}
