import axios from "axios";
import { Board } from "../Models/Board";
import { handleError } from "../Helpers/HandleError";


const api = "http://127.0.0.1:8000/api/kanban"

export const BoardAPI = async (name: string, status: string) => {
    try {
        const data = await axios.post<Board>(api + "/board", {
            name: name,
            status: status,
        });

        return data;
    } catch (error) {
        handleError(error);
        throw (error);
    }
}

export const BoardGetAPI = async () => {
    try {
        const data = await axios.get<Board[]>(api + "/board-list");
        return data;
    } catch (error) {
        handleError(error);
        throw error;
    }
};

export const BoardGetByIdAPI = async (id: number) => {
    try {
        const data = await axios.get(api + `/board-show/${id}`);
        return data;
    } catch (error) {
        throw new Error("Error fetching board by ID");
    }
};


export const BoardDeleteAPI = async (id: number) => {
    try {
        const data = await axios.delete(api + `/board-delete/${id}`);
        return data;
    } catch (error) {
        throw new Error("No Id Can Be Delete");
    }
}

export const FourBoardAPI = async () => {
    try {
        const data = await axios.get<Board[]>(api + "/board-four");
        return data;

    } catch (error) {
        handleError(error);
        throw error;
    }
}

export const BoardUpdateAPI = async (id: number, newInput: { name: string, status: string }) => {
    try {
        const data = await axios.put(api + `/board-update/${id}`, newInput);
        return data;
    } catch (error) {
        handleError(error);
        throw error;
    }
};



// _________________BATAS______________________


export const CreateColumnApi = async (boardId: number, name: string, position: number) => {
    try {
        const data = await axios.post<Column>(api + `/board/column/${boardId}`, {
            name: name,
            position: position
        });
        return data;
    } catch (error) {
        handleError(error);
        throw error;
    }
};

export const ColumnsGetAPI = async (id: number) => {
    try {
        const data = await axios.get(api + `/board/column-list/${id}`);
        return data;
    } catch (error) {
        handleError(error);
        throw (error)
    }
}


export const UpdateColumnAPI = async (board_id: number, id: number, name: string) => {
    try {
        const data = await axios.put(api + `/board/column-update/${id}`, {
            name: name,
            board_id: board_id,
        });

        return data;

    } catch (error) {
        handleError(error);
        throw (error)
    }
};


export const deleteColumnAPI = async (id: number) => {
    try {
        const data = await axios.delete(`http://127.0.0.1:8000/api/kanban/board/column-delete/${id}`);
        return data;

    } catch (error) {
        handleError(error);
        throw (error)
    }
};



// -------------------------------------- TASK ---------------------------------------

const fetchTasks = async (boardId: number) => {
    try {
        const response = await axios.get(`http://127.0.0.1:8000/api/kanban/board/${boardId}/tasks`);
        return response.data; // Adjust according to your API response
    } catch (error) {
        console.error("Failed to fetch tasks:", error);
        return []; // Return empty array on error
    }
};

