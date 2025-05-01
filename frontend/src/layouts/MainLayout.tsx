import { Outlet, useNavigate } from "react-router";
import { Box, CssBaseline } from "@mui/material";
import Sidebar, { DrawerHeader } from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { DRAWER_WIDTH } from "../data/Constants";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

export default function MainLayout() {

    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const [openSidebar, setOpenSidebar] = useState<boolean>(false);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/");
        }
    }, [isAuthenticated, navigate]);

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box sx={{ display: "flex", flexGrow: 1 }}>
                <CssBaseline />
                <Navbar openSidebar={openSidebar} setOpenSidebar={setOpenSidebar} />
                <Sidebar openSidebar={openSidebar} setOpenSidebar={setOpenSidebar} />
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
    );

}