import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useBoardContext } from "../../Context/useBoard";
import VELO from "../../assets/VELO/VELO _ HORIZONTAL BLACK.png"
import line from "../../assets/VELO/line.png"

const SidebarLayout = () => {


    const navigate = useNavigate();
    const { fourBoard } = useBoardContext();


    const handleNavigateToBoard = (boardId: number) => {
        navigate(`/board/${boardId}`);
    };


    const dashboard = () => {
        navigate("/dashboard")
    }
    const location = useLocation();



    const isProfilePage = window.location.pathname === '/profile';
    const currentBoardId = Number(location.pathname.split('/').pop()); // Convert to number
    // console.log(currentBoardId)
    return (

        <>

            <aside
                id="separator-sidebar"
                className={`fixed top-0 left-0 border z-30 w-52 h-screen transition-transform -translate-x-full sm:translate-x-0 ${isProfilePage ? 'hidden' : 'block'}`}
                aria-label="Sidebar"
            >
                <div className="h-full flex flex-col justify-between py-4 overflow-y-auto bg-white dark:bg-gray-800">

                    <div className="flex-grow">
                        <div className="flex items-center ml-4 -mt-11">
                            <img onClick={dashboard} src={VELO} className="h-40 w-40 cursor-pointer" alt="VELO" />
                        </div>

                        <ul className="space-y-2 font-medium mt-6 text-center ">
                            <li>
                                <NavLink
                                    to={"/dashboard"}
                                    className={`flex items-center p-2 w-full group relative ${window.location.pathname === '/dashboard'
                                        ? "text-white bg-black dark:text-blue-500 dark:bg-gray-700"
                                        : "text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                                        }`}
                                >
                                    {window.location.pathname === '/dashboard'
                                        ?
                                        <div className="bg-[#0195FF] h-6 w-2 z-10 -ml-2"></div>
                                        :
                                        ''
                                    }
                                    <span
                                        className={`absolute inset-0 bg-cover bg-center ${window.location.pathname === '/dashboard' ? "opacity-30" : "opacity-0"
                                            }`}
                                        style={{
                                            backgroundImage: `url(${line})`,
                                        }}
                                    />

                                    <div className="flex items-center justify-center flex-1">
                                        <i className="fa-solid text-xl fa-chart-pie mr-2"></i>
                                        <span className="text-xl font-semibold whitespace-nowrap">Dashboard</span>
                                    </div>
                                </NavLink>

                            </li>
                            <li>
                                <NavLink
                                    to={"/teams"}
                                    className={`flex items-center justify-center p-2 w-full group relative ${window.location.pathname === '/teams'
                                        ? "text-white bg-black dark:text-blue-500 dark:bg-gray-700"
                                        : "text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                                        }`}
                                >
                                    {window.location.pathname === '/teams'
                                        ?
                                        <div className="bg-[#0195FF] h-6 w-2 z-10 -ml-2"></div>
                                        :
                                        ''
                                    }

                                    <span
                                        className={`absolute inset-0 bg-cover bg-center  ${window.location.pathname === '/teams' ? "opacity-30" : "opacity-0"
                                            }`}
                                        style={{
                                            backgroundImage: `url(${line})`,
                                        }}
                                    />
                                    <div className="flex items-center justify-center flex-1">
                                        <i className="fa-solid text-xl fa-users mr-2"></i>
                                        <span className="text-xl font-semibold whitespace-nowrap">Teams</span>
                                    </div>
                                </NavLink>

                            </li>

                        </ul>
                    </div>

                    <div className="mt-auto text-center">
                        <h4 className="text-gray-500 mb-4 font-semibold text-center">Recently</h4>
                        <ul className="space-y-2 mb-5">
                            {fourBoard && fourBoard.length > 0 ? (
                                fourBoard.map((board) => (
                                    <li key={board.id}>
                                        <a
                                            className={`block p-2 mt-5 mx-12 cursor-pointer border text-center bg-white rounded-lg ${board.id === currentBoardId ? 'bg-black text-blue-500' : ''
                                                }`}
                                            onDoubleClick={() => handleNavigateToBoard(board.id)}
                                        >
                                            <p className="text-xs text-gray-400">
                                                {board.status}
                                            </p>
                                            <p className="truncate font-bold">
                                                {board.name}
                                            </p>
                                        </a>
                                    </li>
                                ))
                            ) : (
                                <span className="text-gray-500 pl-4 text-center items-center">No boards available</span>
                            )}
                        </ul>
                    </div>
                </div>
            </aside>



        </>
    );
};

export default SidebarLayout;
