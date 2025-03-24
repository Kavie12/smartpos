import { Outlet } from "react-router";
import SidebarProvider from "../context/SidebarContext";
import { Box, CssBaseline } from "@mui/material";
import Sidebar, { DrawerHeader } from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { DRAWER_WIDTH } from "../data/Constants";

export default function MainLayout() {
    return (
        <SidebarProvider>
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
        </SidebarProvider >
    );

}