import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../Context/useAuth';
import SidebarLayout from '../Pages/Layouts/Sidebar';
import NavbarLayout from '../Pages/Layouts/Navbar';
type Props = { children: React.ReactNode }

export default function ProtectedRoute({ children }: Props) {
    const location = useLocation();
    const { isLoggedIn } = useAuth();

    const isProfilePage = window.location.pathname === '/profile';
    const isTeamsPage = window.location.pathname === '/teams';


    return isLoggedIn() ? (
        <div>
            <NavbarLayout />
            < SidebarLayout />
            <div className={`${isProfilePage ? 'p-4 ' : 'p-4 sm:ml-64'}`}>
                <div className={`${isProfilePage ? 'p-4 mx-10 mt-16' : 'p-4 ml-11 mt-32'} ${isTeamsPage ? 'p-4 mx-10 mt-16' : ''} `}>
                    <div>
                        {children}
                    </div>
                </div>
            </div>
        </div>

    ) : (<Navigate to={"/login"} state={{ from: location }} replace />);

}