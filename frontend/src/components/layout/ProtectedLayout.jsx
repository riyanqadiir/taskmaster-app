// ProtectedLayout.jsx
import React, { useEffect, useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import "./layout.css";

export default function ProtectedLayout({ children }) {
    const [showSidebar, setShowSidebar] = useState(true);

    useEffect(() => {
        const setByWidth = () => setShowSidebar(window.innerWidth >= 992);
        setByWidth();
        window.addEventListener("resize", setByWidth);
        return () => window.removeEventListener("resize", setByWidth);
    }, []);

    return (
        <div className="app-shell">
            <Header onMenuClick={() => setShowSidebar(s => !s)} />

            {/* Grid body: column 1 = sidebar, column 2 = main */}
            <div
                className={`app-content ${showSidebar ? "has-sidebar" : "no-sidebar"}`}
                style={{ ["--sidebar-w"]: showSidebar ? "240px" : "0px" }} // desktop only
            >
                {/* Desktop sidebar (Offcanvas still renders inside Sidebar for mobile) */}
                <Sidebar
                    show={showSidebar}
                    onHide={() => setShowSidebar(false)}
                    width={240}
                />

                {/* Main area */}
                <section className="main-col">
                    <main className="main-inner">{children}</main>
                </section>
            </div>

            <Footer />
        </div>
    );
}
