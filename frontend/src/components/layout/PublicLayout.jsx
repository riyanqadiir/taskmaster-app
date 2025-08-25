import React from "react";
import { Box } from "@mui/material";
import Footer from "./Footer";

function PublicLayout({ children }) {
    return (
        <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
            <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {children}
            </Box>
            <Footer />
        </Box>
    );
}

export default PublicLayout;
