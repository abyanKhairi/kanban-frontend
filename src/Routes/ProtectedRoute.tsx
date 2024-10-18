import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../Context/useAuth';
import SidebarLayout from '../Pages/Layouts/Sidebar';
import NavbarLayout from '../Pages/Layouts/Navbar';
type Props = { children: React.ReactNode }

export default function ProtectedRoute({ children }: Props) {
    const location = useLocation();
    const { isLoggedIn } = useAuth();
    return isLoggedIn() ? (
        <div>
            <NavbarLayout />
            < SidebarLayout />
            <div className="md:pl-[250px] pl-[60px] pr-[20px] pt-[70px] w-full h-full overflow-y-auto">
                {children}
            </div>
        </div>

    ) : (<Navigate to={"/login"} state={{ from: location }} replace />);

}