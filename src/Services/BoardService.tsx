import axios from "axios";
import { Board } from "../Models/Board";
import { handleError } from "../Helpers/HandleError";
import { Await } from "react-router-dom";


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

