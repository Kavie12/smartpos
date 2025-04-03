import { createHashRouter } from "react-router";
import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";
import LoginScreen from "../pages/LoginScreen";
import LoyaltyMembersScreen from "../pages/LoyaltyMembers/LoyaltyMembersScreen";
import EmployeesScreen from "../pages/Employees/EmployeesScreen";
import SuppliersScreen from "../pages/Suppliers/SupplierScreen";
import ProductsScreen from "../pages/Products/ProductsScreen";
import StockScreen from "../pages/StockRecords/StockScreen";
import CreateBillScreen from "../pages/Billing/CreateBillScreen";
import BillingScreen from "../pages/Billing/BillingScreen";
import AddProductScreen from "../pages/Products/AddProductScreen";
import AddSupplierScreen from "../pages/Suppliers/AddSupplierScreen";
import AddLoyaltyMemberScreen from "../pages/LoyaltyMembers/AddLoyaltyMemberScreen";
import AddEmployeeScreen from "../pages/Employees/AddEmployeeScreen";
import BillDetailsScreen from "../pages/Billing/BillDetailsScreen";
import AddStockRecordScreen from "../pages/StockRecords/AddStockRecordScreen";
import UpdateStockRecordScreen from "../pages/StockRecords/UpdateStockRecordScreen";

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
                    { path: "bill_details/:billId", element: <BillDetailsScreen /> }
                ]
            },
            {
                path: "stock_records",
                children: [
                    { index: true, element: <StockScreen /> },
                    { path: "add_stock_record", element: <AddStockRecordScreen /> },
                    { path: "update_stock_record/:recordId", element: <UpdateStockRecordScreen /> }
                ]
            },
            {
                path: "products",
                children: [
                    { index: true, element: <ProductsScreen /> },
                    { path: "add_product", element: <AddProductScreen /> }
                ]
            },
            {
                path: "suppliers",
                children: [
                    { index: true, element: <SuppliersScreen /> },
                    { path: "add_supplier", element: <AddSupplierScreen /> },
                ]
            },
            {
                path: "loyalty_members",
                children: [
                    { index: true, element: <LoyaltyMembersScreen /> },
                    { path: "add_loyalty_member", element: <AddLoyaltyMemberScreen /> },
                ]
            },
            {
                path: "employees",
                children: [
                    { index: true, element: <EmployeesScreen /> },
                    { path: "add_employee", element: <AddEmployeeScreen /> },
                ]
            },
        ]
    }
]);