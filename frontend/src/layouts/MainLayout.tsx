import { useEffect } from "react";
import Navbar from "../components/Navbar";
import { Outlet, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";

export default function MainLayout() {

    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {

        if (!isAuthenticated) {
            navigate("/login");
        }

    }, [isAuthenticated, navigate]);

    return (
        <>
            <Navbar />
            <Outlet />
        </>
    );

}