import { createContext, useState, useContext, useEffect } from "react";
import { Board } from "../Models/Board";
import { BoardAPI, BoardGetAPI } from "../Services/BoardService";
import { toast } from "react-toastify";

type BoardContextType = {
    boardCreate: (name: string, status: string) => Promise<void>;
    boards: Board[];
}

type Props = { children: React.ReactNode };

const BoardContext = createContext<BoardContextType>({} as BoardContextType);

export const useBoardContext = () => useContext(BoardContext);

export const BoardProvider = ({ children }: Props) => {
    const [boards, setBoard] = useState<Board[]>([]);


    const GetBoards = async () => {
        try {
            const res = await BoardGetAPI();
            setBoard(res.data.data); // Store boards in state
            console.log(res)
        } catch (e) {
            // toast.error("Error fetching boards");
        }
    };

    useEffect(() => {
        GetBoards();
    }, []);


    const boardCreate = async (name: string, status: string) => {
        try {
            const res = await BoardAPI(name, status);
            // toast.success("Board created successfully!");
            await GetBoards();
        } catch (e) {
            toast.error("Error creating board");
        }
    }

    return (
        <BoardContext.Provider value={{ boardCreate, boards }}>
            {children}
        </BoardContext.Provider>
    );
};
