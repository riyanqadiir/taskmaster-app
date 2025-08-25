import { AppBar, Toolbar, Typography, Box } from "@mui/material";
import LogoutButton from "../authentication/LogoutButton";

function Header() {
    return (
        <AppBar
            position="fixed"
            sx={{
                width: "100%",
                zIndex: (theme) => theme.zIndex.drawer + 1, // keep above sidebar
                bgcolor: "#1976d2",
            }}
        >
            <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="h6" noWrap component="div">
                    TaskMaster Dashboard
                </Typography>

                <Box>
                    <LogoutButton />
                </Box>
            </Toolbar>
        </AppBar>
    );
}

export default Header;
