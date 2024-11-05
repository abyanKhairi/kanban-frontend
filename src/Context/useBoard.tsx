import { createContext, useState, useContext, useEffect } from "react";
import { Board, Columns, Id, Tasks } from "../Models/Board";
import { BoardAPI, BoardDeleteAPI, BoardGetAPI, BoardGetByIdAPI, BoardUpdateAPI, CollaboratingShowBoard, CollaboratorAPI, CollaboratorDeleteAPI, CollaboratorPermissionUpdateAPI, ColumnsGetAPI, CreateColumnApi, deleteColumnAPI, editTaskAPI, FourBoardAPI, GetCollaboratorsPermissions, GetPermissionsAPI, UpdateColumnAPI } from "../Services/BoardService";
import { toast } from "react-toastify";
import { useAuth } from "./useAuth";
import Swal from 'sweetalert2';
import { handleError } from "../Helpers/HandleError";


type BoardContextType = {
    boardCreate: (name: string, status: string) => Promise<void>;
    boards: Board[];
    getBoardById: (id: number) => Promise<Board | null>;
    handleDeleteBoard: (id: number) => Promise<void>;
    fourBoard: Board[];
    updateBoard: (id: number, status: string, name: string) => Promise<void>;

    CreateColumn: (boardId: number, name: string, position: number) => Promise<void>;
    ColumnUpdate: (id: number, name: string) => Promise<void>;
    DeleteColumn: (id: number) => Promise<void>;
    ColumnGet: (id: number) => Promise<Columns[]>
    EditTask: (board_id: number, id: number, title: string, deadline?: Date, description?: string, status?: string) => Promise<void>

    CollaboratorInvite: (board_id: number, email: string) => Promise<void>
    fetchPermissions: (id: number) => Promise<void>
    permissions: []
    CollaboratorsPermissions: (board_id: number) => Promise<void>
    ShowCollaboratorBoard: (board_id: number) => Promise<void>
    CollaboratorDelete: (board_id: number, permission_id: number) => Promise<void>
    // CollaboratorPermission: (board_id: number, permission_id: number) => Promise<void>
    CollaboratorPermissionUpdate: (permission_id: number, add_cards: boolean, edit_cards: boolean, delete_cards: boolean, add_members: boolean, manage_board: boolean) => Promise<void>
}

type Props = { children: React.ReactNode };

const BoardContext = createContext<BoardContextType>({} as BoardContextType);

export const useBoardContext = () => useContext(BoardContext);

export const BoardProvider = ({ children }: Props) => {
    const [boards, setBoard] = useState<Board[]>([]);
    const [columns, setColumns] = useState<Columns[]>([]);
    // const [task, setTask] = useState<Tasks[]>([]);
    const [fourBoard, setFourBoard] = useState<Board[]>([]);
    const { isLoggedIn } = useAuth()
    const [permissions, setPermissions] = useState<[]>([]);
    const { user } = useAuth()
    // console.log(permissions)



    // Untuk Board

    const GetBoards = async () => {
        try {
            const res = await BoardGetAPI();
            setBoard(res.data.data);
        } catch (e) {
        }
    };

    useEffect(() => {
        if (!isLoggedIn()) return;
        GetBoards();
    }, [user?.id]);



    const GetBoardFour = async () => {
        try {
            const res = await FourBoardAPI();
            setFourBoard(res.data.data);
        } catch (e) {
        }
    };

    useEffect(() => {
        if (!isLoggedIn()) return;
        GetBoardFour();
    }, [user?.id]);


    const getBoardById = async (id: number): Promise<Board | null> => {
        try {
            const res = await BoardGetByIdAPI(id);
            const board: Board = res.data.data;
            // console.log(board.column); 
            // console.log("Fetching permissions for board ID:", board.id);

            // await fetchPermissions(board.id);

            return board
        } catch (e) {
            // toast.error("Error fetching board by ID");
            return null;
        }
    };

    const boardCreate = async (name: string, status: string) => {
        try {
            const res = await BoardAPI(name, status);
            toast.success("Board created successfully!");
            await GetBoards();
            await GetBoardFour();
        } catch (e) {
            toast.error("Error creating board");
        }
    }


    const handleDeleteBoard = async (id: number) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            try {
                await BoardDeleteAPI(id);
                setBoard(prevBoards => prevBoards.filter(board => board.id !== id));
                setFourBoard(prevBoards => prevBoards.filter(board => board.id !== id));
                toast.success("Success To Delete Board");
            } catch (error) {
                toast.error("Error To Delete Board");
            }
        }
    };


    const updateBoard = async (id: number, name: string, status: string) => {
        try {
            await BoardUpdateAPI(id, { name, status });
            await GetBoards();
            await GetBoardFour();
            toast.success("Board Updated");
        } catch (e) {
            toast.error("Error Update Board");
        }
    };


    // Akhir Board

    // ------------------BATAS----------------

    // Muali Column

    const CreateColumn = async (boardId: number, name: string, position: number) => {
        try {
            const res = await CreateColumnApi(boardId, name, position);
            const newColumn = {
                id: res.data.data.id,
                name: res.data.data.name,
                position: res.data.data.position,
                board_id: boardId,
            };
            setColumns(prevColumns => [...prevColumns, newColumn]);
            toast.success("Column created successfully!");
        } catch (error) {
            toast.error("Error creating column");
        }
    };



    const ColumnGet = async (id: number): Promise<Columns | null> => {
        try {
            const res = await ColumnsGetAPI(id);
            const columnsBanyak: Columns = res.data.data
            return columnsBanyak
        } catch (error) {
            return null;

        }
    }


    const ColumnUpdate = async (board_id: number, id: number, name: string) => {
        try {
            await UpdateColumnAPI(board_id, id, name);
            await ColumnGet(board_id);
            setColumns(prevColumns =>
                prevColumns.map(column =>
                    column.id === id ? { ...column, name: name } : column
                )
            );
            toast.success("Column Diupdate");
        } catch (error) {
            console.error("Error updating column:", error);
            toast.error("Column gagal  Diupdate");
            return null;

        }
    };

    const DeleteColumn = async (id: number) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            try {
                await deleteColumnAPI(id);
                await ColumnGet(id);
                setColumns(prevColumns => prevColumns.filter(column => column.id !== id));
                toast.success("Column Dihapus");
            } catch (error) {
                toast.error("Error To Delete Board");
            }
        }
    };



    // ----------------------------------------------- TASK--------------------------

    const EditTask = async (board_id: number, id: number, title: string, deadline?: Date, description?: string, status?: string) => {
        try {
            await editTaskAPI(board_id, id, title, deadline, description, status);
            setColumns(prevTask =>
                prevTask.map(task =>
                    task.id === id ? { ...task, title, description, deadline, status } : task
                )
            );
            toast.success("Task Diupdate");
        } catch (error) {
            toast.error("Task Gagal Diupdate");
            throw (error);
        }
    }



    // -------------------------------------- COlab 

    const CollaboratorInvite = async (board_id: number, email: string) => {
        try {
            await CollaboratorAPI(board_id, email);
            toast.success("Collaborator added successfully");
        } catch (error) {
            if (error.response && error.response.status === 409) {
                toast.error("This collaborator already exists on the board.");
            } else {
                toast.error("An error occurred while adding the collaborator.");
            }
        }
    }


    const fetchPermissions = async (boardId: number) => {
        try {
            const permissions = await GetPermissionsAPI(boardId);
            const Perm = {
                edit_cards: permissions.edit_cards,
                delete_cards: permissions.delete_cards,
                add_cards: permissions.add_cards,
                manage_board: permissions.manage_board,
                board_id: permissions.board_id,
                user_id: permissions.user_id,
                add_members: permissions.add_members
            }

            // const coba = boardId == permissions.board_id

            setPermissions(Perm);
            // const tes = res.edit_cards
            // console.log(Perm)
        } catch (error) {
            toast.error("Error fetching permissions");
        }
    };

    const CollaboratorsPermissions = async (board_id: number) => {
        try {
            const collab = await GetCollaboratorsPermissions(board_id)
            return collab
        } catch (error) {
            console.log(error)
            throw (error);
        }
    }

    const ShowCollaboratorBoard = async (board_id: number) => {
        try {
            const collab = await CollaboratingShowBoard(board_id)
            return collab
        } catch (error) {
            console.log(error)
            throw (error);
        }
    }

    const CollaboratorDelete = async (board_id: number, permission_id: number) => {
        try {
            const result = await Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
            });

            if (result.isConfirmed) {
                await CollaboratorDeleteAPI(board_id, permission_id);
                toast.success("Collaborator Deleted");
            }
        } catch (error) {
            console.log(error);
            toast.error("Cannot Delete Collaborator");
        }
    };


    // const CollaboratorPermission = async (board_id: number, permission_id: number) => {
    //     try {
    //         const permissions = await CollaboratorPermissionAPI(board_id, permission_id);
    //         toast.success("Collaborator Permissions Updated")
    //         return permissions;
    //     } catch (error) {
    //         toast.error("Collaborator Permissions Error To Update")
    //     }
    // }

    const CollaboratorPermissionUpdate = async (permission_id: number, add_cards: boolean, edit_cards: boolean, delete_cards: boolean, add_members: boolean, manage_board: boolean) => {
        try {
            await CollaboratorPermissionUpdateAPI(permission_id, add_cards, edit_cards, delete_cards, add_members, manage_board)
        } catch (error) {
            handleError(error)
            console.log(error)
            throw (error)

        }
    }




    return (
        <BoardContext.Provider value={{
            boardCreate, boards, getBoardById, handleDeleteBoard, fourBoard, updateBoard, CreateColumn,
            ColumnUpdate, DeleteColumn, ColumnGet, EditTask, CollaboratorInvite, permissions,
            fetchPermissions, CollaboratorsPermissions, CollaboratorDelete, CollaboratorPermissionUpdate, ShowCollaboratorBoard
        }}>
            {children}
        </BoardContext.Provider>
    );
};
