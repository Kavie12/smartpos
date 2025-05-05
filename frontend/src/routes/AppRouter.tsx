import { createHashRouter } from "react-router";
import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";
import { lazy } from "react";
import RouteLoader from "./RouteLoader";

const LoginScreen = RouteLoader(lazy(() => import("../pages/Auth/LoginScreen")));
const ReportsScreen = RouteLoader(lazy(() => import("../pages/Reports/ReportsScreen")));
const BillingScreen = RouteLoader(lazy(() => import("../pages/Billing/BillingScreen")));
const CreateBillScreen = RouteLoader(lazy(() => import("../pages/Billing/CreateBillScreen")));
const BillDetailsScreen = RouteLoader(lazy(() => import("../pages/Billing/BillDetailsScreen")));
const UpdateBillScreen = RouteLoader(lazy(() => import("../pages/Billing/UpdateBillScreen")));
const StockRecordsScreen = RouteLoader(lazy(() => import("../pages/StockRecords/StockRecordsScreen")));
const AddStockRecordScreen = RouteLoader(lazy(() => import("../pages/StockRecords/AddStockRecordScreen")));
const UpdateStockRecordScreen = RouteLoader(lazy(() => import("../pages/StockRecords/UpdateStockRecordScreen")));
const ProductsScreen = RouteLoader(lazy(() => import("../pages/Products/ProductsScreen")));
const AddProductScreen = RouteLoader(lazy(() => import("../pages/Products/AddProductScreen")));
const UpdateProductScreen = RouteLoader(lazy(() => import("../pages/Products/UpdateProductScreen")));
const SuppliersScreen = RouteLoader(lazy(() => import("../pages/Suppliers/SupplierScreen")));
const AddSupplierScreen = RouteLoader(lazy(() => import("../pages/Suppliers/AddSupplierScreen")));
const UpdateSupplierScreen = RouteLoader(lazy(() => import("../pages/Suppliers/UpdateSupplierScreen")));
const LoyaltyMembersScreen = RouteLoader(lazy(() => import("../pages/LoyaltyMembers/LoyaltyMembersScreen")));
const AddLoyaltyMemberScreen = RouteLoader(lazy(() => import("../pages/LoyaltyMembers/AddLoyaltyMemberScreen")));
const UpdateLoyaltyMemberScreen = RouteLoader(lazy(() => import("../pages/LoyaltyMembers/UpdateLoyaltyMemberScreen")));
const EmployeesScreen = RouteLoader(lazy(() => import("../pages/Employees/EmployeesScreen")));
const AddEmployeeScreen = RouteLoader(lazy(() => import("../pages/Employees/AddEmployeeScreen")));
const UpdateEmployeeScreen = RouteLoader(lazy(() => import("../pages/Employees/UpdateEmployeeScreen")));
const CreateCredentialsScreen = RouteLoader(lazy(() => import("../pages/Employees/CreateCredentialsScreen")));
const EmployeeProfileScreen = RouteLoader(lazy(() => import("../pages/Settings/EmployeeProfileScreen")));
const ChangePasswordScreen = RouteLoader(lazy(() => import("../pages/Settings/ChangePasswordScreen")));

export default createHashRouter([
    {
        element: <AuthLayout />,
        children: [
            { index: true, element: <LoginScreen /> },
        ]
    },
    {
        element: <MainLayout />,
        children: [
            {
                path: "billing",
                children: [
                    { index: true, element: <BillingScreen /> },
                    { path: "create_bill", element: <CreateBillScreen /> },
                    { path: "bill_details/:billId", element: <BillDetailsScreen /> },
                    { path: "update_bill/:billId", element: <UpdateBillScreen /> }
                ]
            },
            {
                path: "stock_records",
                children: [
                    { index: true, element: <StockRecordsScreen /> },
                    { path: "add_stock_record", element: <AddStockRecordScreen /> },
                    { path: "update_stock_record/:recordId", element: <UpdateStockRecordScreen /> }
                ]
            },
            {
                path: "products",
                children: [
                    { index: true, element: <ProductsScreen /> },
                    { path: "add_product", element: <AddProductScreen /> },
                    { path: "update_product/:productId", element: <UpdateProductScreen /> }
                ]
            },
            {
                path: "suppliers",
                children: [
                    { index: true, element: <SuppliersScreen /> },
                    { path: "add_supplier", element: <AddSupplierScreen /> },
                    { path: "update_supplier/:supplierId", element: <UpdateSupplierScreen /> }
                ]
            },
            {
                path: "loyalty_members",
                children: [
                    { index: true, element: <LoyaltyMembersScreen /> },
                    { path: "add_loyalty_member", element: <AddLoyaltyMemberScreen /> },
                    { path: "update_loyalty_member/:id", element: <UpdateLoyaltyMemberScreen /> }
                ]
            },
            {
                path: "employees",
                children: [
                    { index: true, element: <EmployeesScreen /> },
                    { path: "add_employee", element: <AddEmployeeScreen /> },
                    { path: "update_employee/:employeeId", element: <UpdateEmployeeScreen /> },
                    { path: "create_credentials/:employeeId", element: <CreateCredentialsScreen /> }
                ]
            },
            {
                path: "reports",
                children: [
                    { index: true, element: <ReportsScreen /> },
                    { path: "" },
                ]
            },
            {
                path: "settings",
                children: [
                    { path: "profile", element: <EmployeeProfileScreen /> },
                    { path: "change_password", element: <ChangePasswordScreen /> }
                ]
            }
        ]
    }
]);