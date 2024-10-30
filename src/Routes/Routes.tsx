import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import LoginPage from "../Pages/LoginPage/LoginPage";
import DashboardPage from "../Pages/Dashboard/DashboardPage";
import RegisterPage from "../Pages/RegisterPage/RegisterPage";
import ProtectedRoute from "./ProtectedRoute";
import Board from "../Pages/BoardPage/Board";
import ProfilePage from "../Pages/ProfilePage/ProfilePage";
import TeamsPage from "../Pages/Teams/TeamsPage";

// import { useAuth } from '../Context/useAuth'; // Import useAuth hook

// const LoginOrDashboard = () => {
//     const { isLoggedIn } = useAuth(); // Get the login state
//     return isLoggedIn() ? <DashboardPage /> : <LoginPage />;
// };

export const router = createBrowserRouter([



    {
        path: "/",
        element: <App />,
        children: [
            { path: "login", element: <LoginPage /> },
            { path: "/", element: <LoginPage /> },
            { path: "register", element: <RegisterPage /> },
            {
                path: "dashboard", element:
                    <ProtectedRoute >
                        <DashboardPage />
                    </ProtectedRoute>
            },
            {
                path: "profile", element:
                    <ProtectedRoute >
                        <ProfilePage />
                    </ProtectedRoute>
            },
            {
                path: "board/:id", element: <ProtectedRoute>
                    <Board />
                </ProtectedRoute>
            },
            {
                path: "teams", element: <ProtectedRoute>
                    <TeamsPage />
                </ProtectedRoute>
            }
        ],
    },
]);