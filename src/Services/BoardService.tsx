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
