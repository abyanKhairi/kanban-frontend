import { createContext, useState, useContext, useEffect } from "react";
import { Board } from "../Models/Board";
import { BoardAPI, BoardDeleteAPI, BoardGetAPI, BoardGetByIdAPI, BoardUpdateAPI, FourBoardAPI } from "../Services/BoardService";
import { toast } from "react-toastify";

type BoardContextType = {
    boardCreate: (name: string, status: string) => Promise<void>;
    boards: Board[];
    getBoardById: (id: number) => Promise<Board | null>;
    handleDeleteBoard: (id: number) => Promise<void>; // Return void since no data is returned on delete
    fourBoard: Board[];
    updateBoard: (id: number, status: string, name: string) => Promise<void>;
}

type Props = { children: React.ReactNode };

const BoardContext = createContext<BoardContextType>({} as BoardContextType);

export const useBoardContext = () => useContext(BoardContext);

export const BoardProvider = ({ children }: Props) => {
    const [boards, setBoard] = useState<Board[]>([]);
    const [fourBoard, setFourBoard] = useState<Board[]>([]);


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


    return (
        <BoardContext.Provider value={{ boardCreate, boards, getBoardById, handleDeleteBoard, fourBoard, updateBoard }}>
            {children}
        </BoardContext.Provider>
    );
};
