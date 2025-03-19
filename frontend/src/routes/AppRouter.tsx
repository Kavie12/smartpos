import { createHashRouter } from "react-router";
import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";
import LoginScreen from "../pages/LoginScreen";
import ProtectedRoute from "./ProtectedRoute";
import LoyaltyMembersScreen from "../pages/LoyaltyMembersScreen";
import DashboardScreen from "../pages/DashboardScreen";
import EmployeesScreen from "../pages/EmployeesScreen";
import SuppliersScreen from "../pages/SupplierScreen";
import ProductsScreen from "../pages/ProductsScreen";
import StockScreen from "../pages/StockScreen";
import CreateBillScreen from "../pages/CreateBillScreen";
import BillingHistoryScreen from "../pages/BillingHistoryScreen";

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
                path: "/",
                children: [
                    {
                        path: "dashboard",
                        element: <DashboardScreen />
                    },
                    {
                        path: "stock",
                        element: <StockScreen />
                    },
                    {
                        path: "products",
                        element: <ProductsScreen />
                    },
                    {
                        path: "loyalty_members",
                        element: <LoyaltyMembersScreen />
                    },
                    {
                        path: "employees",
                        element: <EmployeesScreen />
                    },
                    {
                        path: "suppliers",
                        element: <SuppliersScreen />
                    },
                    {
                        path: "create_bill",
                        element: <CreateBillScreen />
                    },
                    {
                        path: "billing",
                        element: <BillingHistoryScreen />
                    }
                ]
            }
        ]
    }
]);