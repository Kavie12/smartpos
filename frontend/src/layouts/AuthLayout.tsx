import { useEffect } from "react";
import Navbar from "../components/Navbar";
import { Outlet, useNavigate } from "react-router";
import axios from "axios";

export default function AuthLayout() {
    let navigate = useNavigate();

    useEffect(() => {
        axios.get('http://localhost:8080/users/verify', {
            withCredentials: true
        })
            .then(() => {
                navigate("/");
            })
            .catch();
    }, []);

    return (
        <>
            <Navbar />
            <Outlet />
        </>
    );
}