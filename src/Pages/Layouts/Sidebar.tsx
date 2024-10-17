import {
    // AppsOutline,
    // HomeOutline,
    // LogOutOutline,
} from "react-ionicons";
import { useAuth } from "../../Context/useAuth";
import { useLocation, useNavigate } from "react-router-dom";

const SidebarLayout = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const navLinks = [
        {
            title: "Home",
            // icon: (
            //     <HomeOutline
            //         color="#555"
            //         width="22px"
            //         height="22px"
            //     />
            // ),
            onClick: () => navigate('/dashboard'),
            active: location.pathname === '/dashboard',

        },
        {
            title: "Boards",
            // icon: (
            //     <AppsOutline
            //         color="#555"
            //         width="22px"
            //         height="22px"
            //     />
            // ),
            onClick: () => navigate('/boards'),
            active: location.pathname === '/boards',
        },
    ];
    return (
        <div className="fixed left-0 top-0 md:w-[230px] w-[60px] overflow-hidden h-full flex flex-col">
            <div className="w-full flex items-center md:justify-start justify-center md:pl-5 h-[70px] bg-[#fff]">
                <span className="text-orange-400 font-semibold text-2xl md:block hidden"></span>
                <span className="text-orange-400 font-semibold text-2xl md:hidden block"></span>
            </div>
            <div className="w-full h-[calc(100vh-70px)] border-r flex flex-col md:items-start items-center gap-2 border-slate-300 bg-[#fff] py-5 md:px-3 px-3 relative">
                {navLinks.map((link) => {
                    return (
                        <div
                            key={link.title}
                            onClick={link.onClick}
                            className={`flex items-center gap-2 w-full rounded-lg hover:bg-orange-300 px-2 py-3 cursor-pointer ${link.active ? "bg-orange-300" : "bg-transparent"
                                }`}
                        >
                            {/* {link.icon} */}
                            <span className="font-medium text-[15px] md:block hidden">{link.title}</span>
                        </div>
                    );
                })}
                <div className="flex absolute bottom-4 items-center md:justify-start justify-center gap-2 md:w-[90%] w-[70%] rounded-lg hover:bg-orange-300 px-2 py-3 cursor-pointer bg-gray-200">
                    {/* <LogOutOutline /> */}
                    <button className="font-medium text-[15px] md:block hidden" onClick={logout}>
                        Log Out
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SidebarLayout;