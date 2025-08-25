import React from "react";
import { Box, Toolbar } from "@mui/material";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

const drawerWidth = 240;

function ProtectedLayout({ children }) {
    return (
        <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
            <Header />

            <Box sx={{ display: "flex", flex: 1 }}>
                <Box
                    component="aside"
                    sx={{
                        width: drawerWidth,
                        flexShrink: 0,
                        bgcolor: "grey.100",
                        borderRight: "1px solid #e0e0e0",
                        minHeight: "calc(100vh - 64px)", 
                        position: "fixed",
                        top: 64,
                        left: 0,
                    }}
                >
                    <Sidebar />
                </Box>
                <Box
                    component="main"
                    sx={{
                        flexGrow: 1,
                        bgcolor: "background.default",
                        p: 3,
                        ml: `${drawerWidth}px`, 
                    }}
                >
                    <Toolbar />
                    {children}
                </Box>
            </Box>
            <Footer />
        </Box>
    );
}

export default ProtectedLayout;
