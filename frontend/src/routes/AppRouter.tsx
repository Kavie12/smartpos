import { createHashRouter } from "react-router";
import DashboardScreen from "../pages/DashboardScreen";
import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";
import LoginScreen from "../pages/LoginScreen";
import LoyaltyCustomersScreen from "../pages/LoyaltyCustomersScreen";
import ProtectedRoute from "./ProtectedRoute";

export default createHashRouter([
    {
        element: <AuthLayout />,
        children: [
            {
                index: true,
                element: <LoginScreen />
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
                path: "/dashboard",
                children: [
                    {
                        index: true,
                        element: <DashboardScreen />
                    },
                    {
                        path: "loyalty_customers",
                        element: <LoyaltyCustomersScreen />
                    }
                ]
            }
        ]
    }
]);