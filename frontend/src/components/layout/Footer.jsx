// Footer.jsx
import { useLayoutEffect, useRef } from "react";

export default function Footer() {
    const ref = useRef(null);

    useLayoutEffect(() => {
        const setVar = () => {
            const h = ref.current?.offsetHeight || 56;
            document.documentElement.style.setProperty("--footer-h", `${h}px`);
        };
        setVar();
        window.addEventListener("resize", setVar);
        return () => window.removeEventListener("resize", setVar);
    }, []);

    return (
        <footer ref={ref} className="bg-dark text-white py-3 text-center app-footer">
            <p className="mb-0">© {new Date().getFullYear()} Task Master. All rights reserved.</p>
        </footer>
    );
}

