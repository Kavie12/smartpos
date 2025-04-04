import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { CssBaseline } from "@mui/material";

export default function AuthLayout() {

    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            navigate("/billing");
        }
    }, [isAuthenticated, navigate]);

    return (
        <>
            <CssBaseline />
            <Outlet />
        </>
    );

}