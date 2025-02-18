import { ReactNode, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {

        if (!isAuthenticated) {
            navigate("/login");
        }

    }, [navigate, isAuthenticated]);

    return children;
}