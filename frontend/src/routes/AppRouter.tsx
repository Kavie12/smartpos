import { createHashRouter } from "react-router";
import DashboardPage from "../views/dashboard/DashboardPage";
import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";
import LoginPage from "../views/login/LoginPage";
import LoyaltyCustomersPage from "../views/loyalty_customers/LoyaltyCustomersPage";
import ProtectedRoute from "./ProtectedRoute";

export default createHashRouter([
    {
        element: <AuthLayout />,
        children: [
            {
                path: "/login",
                element: <LoginPage />
            }
        ]
    },
    {
        element: (
            <ProtectedRoute>
                <MainLayout />
            </ProtectedRoute>
        ),
        children: [
            {
                path: "/",
                element: <DashboardPage />
            },
            {
                path: "/loyalty_customers",
                element: <LoyaltyCustomersPage />
            }
        ]
    }
]);