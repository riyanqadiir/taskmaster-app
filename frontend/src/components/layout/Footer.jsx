import React from "react";
import { Box, Typography } from "@mui/material";

function Footer() {
    return (
        <Box sx={{ textAlign: "center", p: 2, mt: "auto", bgcolor: "grey.200" }}>
            <Typography variant="body2">© 2025 My Dashboard. All rights reserved.</Typography>
        </Box>
    );
}

export default Footer;
