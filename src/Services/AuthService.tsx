import axios from "axios"
import { handleError } from "../Helpers/HandleError";
import { UserProfile, UserProfileToken } from "../Models/User";
import { input } from "framer-motion/m";

const api = "http://127.0.0.1:8000/api/"


export const loginAPI = async (email: string, password: string) => {
    try {
        const response = await axios.post<UserProfileToken>(`${api}auth/login`, {
            email: email,
            password: password
        });
        return response.data;
    } catch (error) {

        if (error.response) {
            throw error.response;
        } else {
            throw new Error("Network Error");
        }
    }
};
export const RegisterAPI = async (email: string, name: string, password: string, password_confirmation: string) => {
    try {
        const data = await axios.post<UserProfileToken>(api + "auth/register", {
            email,
            name,
            password,
            password_confirmation
        });

        return data;
    } catch (error) {
        if (error.response && error.response.data) {
            if (error.response.data.errors && error.response.data.errors.email) {
                throw new Error(`${error.response.data.errors.email[0]}`);
            } else {
                throw new Error("Error TO Register");
            }
        } else {
            throw new Error("Server Error");
        }
    }
};


export const UserAPI = async () => {
    try {
        const data = await axios.get<UserProfile>(api + "auth/me");
        return data;
    } catch (error) {
        handleError(error);
        throw error;
    }
}

export const UserUpdateNameAPI = async (newInput: { name: string }) => {
    try {
        const data = await axios.put(api + `profile/name`, newInput);
        return data;
    } catch (error) {
        handleError(error);
        throw error;
    }
};

export const UserUpdateEmailAPI = async (newInput: { email: string; password: string }) => {
    try {
        const response = await axios.put(api + `profile/email`, newInput);
        return response;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.data) {
            const { errors } = error.response.data;
            if (errors) {
                if (errors.email) {
                    throw new Error(errors.email[0]);
                }
                if (errors.password) {
                    throw new Error(errors.password[0]);
                }
            }
            throw new Error("Gagal memperbarui email");
        } else {
            throw new Error("Kesalahan Server");
        }
    }
};


export const UserUpdatePasswordAPI = async (newInput: { current_password: string, new_password: string, new_password_confirmation: string }) => {
    try {
        const data = await axios.put(api + `profile/password`, newInput);
        return data;
    } catch (error) {
        handleError(error);
        throw error;
    }
};


export const UserUpdateAvatarAPI = async (newInput: { avatar: string }) => {
    try {
        const data = await axios.put(api + 'profile/avatar', newInput)
        return data
    } catch (error) {
        handleError(error);
        throw error;
    }
}