import { AppBar, Box, CssBaseline, Toolbar, Typography } from "@mui/material";
import { Link } from "react-router";

export default function Navbar() {
    return (
        <>
            <CssBaseline />
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static">
                    <Toolbar>
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