import { Menu } from "@mui/icons-material";
import { AppBar, Box, IconButton, Toolbar, Typography } from "@mui/material";
import { Link } from "react-router";
import { useSidebar } from "../context/SidebarContext";

export default function Navbar() {
    const { setOpen } = useSidebar();

    return (
        <>
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static" elevation={0} color="transparent">
                    <Toolbar>
                        <IconButton color="inherit" sx={{ marginRight: 2 }} onClick={() => setOpen(true)}>
                            <Menu />
                        </IconButton>
                        <Link to="/dashboard" style={{ textDecorationLine: "none", color: "inherit" }}>
                            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                                SMARTPOS
                            </Typography>
                        </Link>
                    </Toolbar>
                </AppBar>
            </Box>
        </>
    );
}