import Navbar from "../components/Navbar";
import { Outlet } from "react-router";
import SidebarProvider from "../context/SidebarContext";
import Sidebar from "../components/Sidebar";
import { CssBaseline } from "@mui/material";

export default function MainLayout() {
    return (
        <>
            <SidebarProvider>
                <CssBaseline />
                <Navbar />
                <Sidebar />
                <Outlet />
            </SidebarProvider>
        </>
    );

}