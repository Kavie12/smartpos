import { createBrowserRouter } from "react-router";
import DashboardPage from "../views/dashboard/DashboardPage";

export default createBrowserRouter([
    {
        path: "/",
        element: <DashboardPage />
    }
]);