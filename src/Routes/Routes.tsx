import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import LoginPage from "../Pages/LoginPage/LoginPage";
import DashboardPage from "../Pages/Dashboard/DashboardPage";
import RegisterPage from "../Pages/RegisterPage/RegisterPage";
import ProtectedRoute from "./ProtectedRoute";
import BoardPage from "../Pages/BoardPage/Board";
export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            { path: "login", element: <LoginPage /> },
            { path: "register", element: <RegisterPage /> },
            {
                path: "dashboard", element:
                    <ProtectedRoute >
                        <DashboardPage />
                    </ProtectedRoute>
            },
            {
                path: "boards", element:
                    <ProtectedRoute >
                        <BoardPage />
                    </ProtectedRoute>
            },
        ],
    },
]);