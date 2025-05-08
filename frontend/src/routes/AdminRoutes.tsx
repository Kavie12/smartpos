import { lazy } from "react";
import RouteLoader from "./RouteLoader";

const ReportsScreen = RouteLoader(lazy(() => import("../pages/Reports/ReportsScreen")));
const EmployeesScreen = RouteLoader(lazy(() => import("../pages/Employees/EmployeesScreen")));
const AddEmployeeScreen = RouteLoader(lazy(() => import("../pages/Employees/AddEmployeeScreen")));
const UpdateEmployeeScreen = RouteLoader(lazy(() => import("../pages/Employees/UpdateEmployeeScreen")));
const CreateCredentialsScreen = RouteLoader(lazy(() => import("../pages/Employees/CreateCredentialsScreen")));


export default function getAdminRoutes() {
    const authObject = JSON.parse(localStorage.getItem("authObject") ?? "{}");
    if (authObject?.role === "ADMIN") {
        return AdminRoutesList;
    }
    return [];
};


const AdminRoutesList = [
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
    }
];