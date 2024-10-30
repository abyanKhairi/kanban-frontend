import axios from "axios";
import { Board, Columns } from "../Models/Board";
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
        const data = await axios.post<Columns>(api + `/board/column/${boardId}`, {
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
        const data = await axios.delete(api + `/board/column-delete/${id}`);
        return data;

    } catch (error) {
        handleError(error);
        throw (error)

    }
};



// -------------------------------------- TASK ---------------------------------------

export const editTaskAPI = async (board_id: number, id: number, title: string, deadline?: Date, description?: string, status?: string) => {
    try {
        const data = await axios.put(api + `/board/${board_id}/column-task/task-update/${id}`, {
            title: title,
            description: description,
            deadline: deadline,
            status: status
        });
        return data;
    } catch (error) {
        handleError(error);
        throw (error)
    }
};

export const DeleteTaskAPI = async (board_id: number, id: number) => {
    try {
        const data = await axios.delete(api + `/board/${board_id}/column-task/task-delete/${id}`)
        return data;

    } catch (error) {
        handleError(error);
        throw (error)

    }
}


// --------------------------------------------------------- COLAB---------------------------------

export const CollaboratorAPI = async (board_id: number, email: string) => {
    try {
        const data = await axios.post(api + `/board-member/${board_id}`, {
            email: email
        })
        return data;
    } catch (error) {
        handleError(error);
        throw (error)
    }
}



export const GetPermissionsAPI = async (board_id: number) => {
    try {
        const response = await axios.get(`${api}/board/permissions/${board_id}`);
        return response.data;
    } catch (error) {
        handleError(error);
        throw error;
    }
};


export const GetCollaboratorsPermissions = async (board_id: number) => {
    try {
        const response = await axios.get(api + `/board/collaborator-permission/${board_id}`)
        return response.data
    } catch (error) {
        handleError(error);
        throw error;
    }
}

export const CollaboratingShowBoard = async (board_id: number) => {
    try {
        const response = await axios.get(api + `/board/collaborator-board/${board_id}`)
        return response.data
    } catch (error) {
        handleError(error);
        throw error;
    }
}


export const CollaboratorDeleteAPI = async (board_id: number, permission_id: number) => {
    try {
        const data = await axios.delete(api + `/board/${board_id}/permission/${permission_id}/`)
        return data;
    } catch (error) {
        handleError(error);
        throw error;
    }
}



export const CollaboratorPermissionUpdateAPI = async (permission_id: number, add_cards: boolean, edit_cards: boolean, delete_cards: boolean, add_members: boolean, manage_board: boolean) => {
    try {
        const data = await axios.put(api + `/board/permission-update/${permission_id}`, {
            add_cards: add_cards,
            edit_cards: edit_cards,
            delete_cards: delete_cards,
            add_members: add_members,
            manage_board: manage_board
        })

        return data;
    } catch (error) {
        handleError(error);
        throw (error)
    }

}