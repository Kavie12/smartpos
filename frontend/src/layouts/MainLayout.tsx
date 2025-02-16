import { Outlet, useNavigate } from "react-router";
import Navbar from "../components/Navbar";
import { useEffect } from "react";
import axios from "axios";

export default function MainLayout() {
    let navigate = useNavigate();

    useEffect(() => {
        axios.get('http://localhost:8080/users/verify', {
            withCredentials: true
        })
            .then()
            .catch(() => {
                navigate("/login");
            });
    }, []);

    return (
        <>
            <Navbar full={true} />
            <Outlet />
        </>
    );
}