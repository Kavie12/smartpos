import { Outlet, useNavigate } from "react-router";
import SidebarProvider from "../context/SidebarContext";
import { Box, CssBaseline } from "@mui/material";
import Sidebar, { DrawerHeader } from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { DRAWER_WIDTH } from "../data/Constants";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

export default function MainLayout() {

    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/");
        }
    }, [isAuthenticated, navigate]);

    return (
        <SidebarProvider>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Box sx={{ display: "flex", flexGrow: 1 }}>
                    <CssBaseline />
                    <Navbar />
                    <Sidebar />
                    <Box
                        component="main"
                        sx={{
                            flexGrow: 1,
                            p: 3,
                            width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` }
                        }}
                    >
                        <DrawerHeader />
                        <Outlet />
                    </Box>
                </Box>
            </LocalizationProvider>
        </SidebarProvider>
    );

}