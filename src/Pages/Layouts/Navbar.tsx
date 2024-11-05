import { useState } from "react";
import VELO from "../../assets/VELO/VELO _ HORIZONTAL BLACK.png"
import { useAuth } from "../../Context/useAuth";
import { Link, useNavigate } from "react-router-dom";

const NavbarLayout = () => {
    const navigate = useNavigate()
    const { user, logout } = useAuth()

    const dashboard = () => {
        navigate("/dashboard")
    }

    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };
    return (
        <>


            {/* <nav className="bg-white dark:bg-gray-900 fixed w-full z-0 top-0 start-0 border-b h-28 border-gray-200 dark:border-gray-600"> */}
            <nav className="bg-white dark:bg-gray-900 fixed w-full z-20 top-0 start-0 border-b h-24    border-gray-200 dark:border-gray-600">

                <div className=" flex items-center  mx-auto p-4 h-[70px]">
                    <div className="flex items-center mt-[2.2rem] -mx-[0.1rem]">
                        <img src={VELO} onClick={dashboard} className="h-40 w-40 cursor-pointer" alt="VELO" />
                    </div>
                    <div className="relative ml-auto mr-14 mt-8">
                        {/* User Info Section */}
                        <div className="flex items-center space-x-3 cursor-pointer" onClick={toggleDropdown}>
                            <span className="text-gray-800 dark:text-white text-lg font-medium">Hello, {user?.name} !</span>
                            <img
                                src={`/src/assets/avatar/${user?.avatar}`}
                                alt="User Avatar"
                                className="h-12 w-12 rounded-full border-2 border-[#54afe5]"
                            />
                        </div>

                        {/* Dropdown */}
                        {isOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-10">
                                <ul className="py-2">
                                    <li>
                                        <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600">
                                            Profile
                                        </Link>
                                    </li>
                                    <li>
                                        <button
                                            onClick={logout}
                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                                        >
                                            Logout
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>

                </div >
            </nav >


        </>

    );
};

export default NavbarLayout;