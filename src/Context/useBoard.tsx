import { createContext, useState, useContext, useEffect } from "react";
import { Board, Columns, Id, Tasks } from "../Models/Board";
import { BoardAPI, BoardDeleteAPI, BoardGetAPI, BoardGetByIdAPI, BoardUpdateAPI, ColumnsGetAPI, CreateColumnApi, deleteColumnAPI, FourBoardAPI, GetTaskAPI, UpdateColumnAPI } from "../Services/BoardService";
import { toast } from "react-toastify";


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


}

type Props = { children: React.ReactNode };

const BoardContext = createContext<BoardContextType>({} as BoardContextType);

export const useBoardContext = () => useContext(BoardContext);

export const BoardProvider = ({ children }: Props) => {
    const [boards, setBoard] = useState<Board[]>([]);
    const [columns, setColumns] = useState<Columns[]>([]);
    const [fourBoard, setFourBoard] = useState<Board[]>([]);



    // Untuk Board

    const GetBoards = async () => {
        try {
            const res = await BoardGetAPI();
            setBoard(res.data.data);
            // console.log(res)
        } catch (e) {
            // toast.error("Error fetching boards");
        }
    };

    useEffect(() => {
        GetBoards();
    }, []);



    const GetBoardFour = async () => {
        try {
            const res = await FourBoardAPI();
            setFourBoard(res.data.data);
        } catch (e) {
            // toast.error("Error fetching boards");
        }
    };

    useEffect(() => {
        GetBoardFour();
    }, []);


    const getBoardById = async (id: number): Promise<Board | null> => {
        try {
            const res = await BoardGetByIdAPI(id);
            const board: Board = res.data.data;
            // console.log(board.column); 
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
        try {
            await BoardDeleteAPI(id);
            setBoard(prevBoards => prevBoards.filter(board => board.id !== id));
            setFourBoard(prevBoards => prevBoards.filter(board => board.id !== id));
            toast.success("Board deleted successfully!");
        } catch (error) {
            toast.error("Error To Delete Board");
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
        try {
            await deleteColumnAPI(id);
            await ColumnGet(id);
            setColumns(prevColumns => prevColumns.filter(column => column.id !== id));
            toast.success("Column Dihapus");
        } catch (error) {
            toast.success("Column Gagal Dihapus");
        }
    }








    return (
        <BoardContext.Provider value={{ boardCreate, boards, getBoardById, handleDeleteBoard, fourBoard, updateBoard, CreateColumn, ColumnUpdate, DeleteColumn, ColumnGet }}>
            {children}
        </BoardContext.Provider>
    );
};
