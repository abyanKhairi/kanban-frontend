import axios from "axios"
import { handleError } from "../Helpers/HandleError";
import { UserProfileToken } from "../Models/User";

const api = "http://127.0.0.1:8000/api/"

export const loginAPI = async (email: string, password: string) => {
    try {
        const data = await axios.post<UserProfileToken>(api + "auth/login", {
            email: email,
            password: password
        });

        return data;
    } catch (error) {
        handleError(error);
    }
};

export const RegisterAPI = async (email: string, name: string, password: string) => {
    try {
        const data = await axios.post<UserProfileToken>(api + "auth/register", {
            email: email,
            name: name,
            password: password
        });

        return data;
    } catch (error) {
        handleError(error);
    }
};