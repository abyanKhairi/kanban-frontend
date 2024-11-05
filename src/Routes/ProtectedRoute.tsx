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
            <div className={`${isProfilePage ? 'p-6 ' : 'p-10 sm:ml-52'}`}>
                <div className={`${isProfilePage ? 'mx-10 mt-16' : 'mx-12 mt-20'} ${isTeamsPage ? 'mx-10 mt-16' : ''} `}>
                    <div>
                        {children}
                    </div>
                </div>
            </div>
        </div>

    ) : (<Navigate to={"/login"} state={{ from: location }} replace />);

}