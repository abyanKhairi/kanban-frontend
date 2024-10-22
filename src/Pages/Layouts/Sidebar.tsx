import { useAuth } from "../../Context/useAuth";
import { useLocation, useNavigate } from "react-router-dom";
import { Sidebar } from "flowbite-react";
import { HiArrowSmRight, HiChartPie, HiInbox, HiShoppingBag, HiTable, HiUser } from "react-icons/hi";
import { useBoardContext } from "../../Context/useBoard";


const SidebarLayout = () => {


    const { logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const { fourBoard } = useBoardContext();

    const handleNavigateToBoard = (boardId: number) => {
        navigate(`/board/${boardId}`);
    };

    const navLinks = [
        {
            title: "Home",
            icon: HiChartPie,
            onClick: () => navigate('/dashboard'),
            active: location.pathname === '/dashboard',

        },

    ];
    return (
        <div className="fixed left-0 top-0 md:w-[230px] w-[60px] overflow-hidden h-full flex flex-col ">
            <div className="w-full flex items-center md:justify-start justify-center md:pl-5 h-[70px] bg-[#fff]">
                <span className="text-orange-400 font-semibold text-2xl md:block hidden">Tes</span>
                <span className="text-orange-400 font-semibold text-2xl md:hidden block">Tes</span>
            </div>
            <Sidebar>
                <Sidebar.Items>
                    <Sidebar.ItemGroup>
                        {navLinks.map((link) => {
                            return (
                                <Sidebar.Item
                                    key={link.title}
                                    onClick={link.onClick}
                                    className={`rounded-lg cursor-pointer hover:bg-orange-300  ${link.active ? "bg-orange-300" : "bg-transparent"
                                        }`}
                                    icon={link.icon}
                                >
                                    <span className="font-medium text-[15px] md:block hidden">{link.title}</span>
                                </Sidebar.Item>
                            );
                        })}
                        <Sidebar.Collapse className="cursor-grab" icon={HiTable} label="Boards">
                            {fourBoard && fourBoard.length > 0 ? (
                                fourBoard.map((board, index) => (
                                    <Sidebar.Item className={"cursor-pointer"} onClick={() => handleNavigateToBoard(board.id)} key={index}>
                                        {board.name}
                                    </Sidebar.Item>
                                ))
                            ) : (
                                <span className="text-gray-500 pl-4">No boards available</span>
                            )}
                        </Sidebar.Collapse>
                    </Sidebar.ItemGroup>
                </Sidebar.Items>
            </Sidebar>
            <button onClick={logout} >Logout</button>
        </div>
    );
};

export default SidebarLayout;
