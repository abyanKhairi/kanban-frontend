import React, { createContext, useEffect, useState } from "react";
import { UserProfile } from "../Models/User";
import { useNavigate } from "react-router-dom";
import { loginAPI, RegisterAPI, UserUpdateAvatarAPI, UserUpdateEmailAPI, UserUpdateNameAPI, UserUpdatePasswordAPI } from "../Services/AuthService";
import { toast } from "react-toastify";
import axios from "axios";
import Swal from "sweetalert2";

type UserContextType = {
    user: UserProfile | null;
    token: string | null;
    registerUser: (email: string, name: string, password: string, password_confirmation: string) => void;
    loginUser: (email: string, password: string) => void;
    logout: () => void;
    isLoggedIn: () => boolean;
    UserUpdateName: (name: string) => Promise<void>;
    UserUpdateEmail: (email: string, password: string) => Promise<void>;
    UserUpdatePassword: (current_password: string, new_password: string, new_password_confirmation: string) => Promise<void>;
    UserUpdateAvatar: (avatar: string) => Promise<void>;
};

type Props = { children: React.ReactNode };

const UserContext = createContext<UserContextType>({} as UserContextType);

export const UserProvider = ({ children }: Props) => {
    const navigate = useNavigate();
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<UserProfile | null>(null);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const savedToken = localStorage.getItem("token");
        const savedUser = localStorage.getItem("user");
    
        if (savedToken) {
            setToken(savedToken);
            setUser(JSON.parse(savedUser || "{}"));
            axios.defaults.headers.common["Authorization"] = "Bearer " + savedToken;
        }
    
        const interceptor = axios.interceptors.response.use(
            (response) => response,
            async (error) => {
                if (error.response && error.response.status === 401) {
                    await Swal.fire({
                        title: "Session Expired",
                        text: "Your session has expired. Please log in again.",
                        icon: "warning",
                        confirmButtonText: "OK",
                    });
                    
                    // Clear user data and redirect to login
                    logout();
                }
                return Promise.reject(error);
            }
        );
    
        setIsReady(true);
    
        return () => {
            axios.interceptors.response.eject(interceptor);
        };
    }, [navigate]);
    
    const registerUser = async (email: string, name: string, password: string, password_confirmation: string) => {
        try {
            const res = await RegisterAPI(email, name, password, password_confirmation);
            if (res) {
                toast.success("Register Success!");
                navigate("/login");
            }
        } catch (error: any) {
            toast.warning(error.message || "Server Error");
        }
    };

    const loginUser = async (email: string, password: string) => {
        try {
            const res = await loginAPI(email, password);
            if (res) {
                localStorage.setItem("token", res.token);
                const userObj = {
                    name: res.user.name,
                    email: res.user.email,
                    avatar: res.user.avatar,
                    id: res.user.id
                };
                localStorage.setItem("user", JSON.stringify(userObj));
                setToken(res.token);
                setUser(userObj);
                axios.defaults.headers.common["Authorization"] = "Bearer " + res.token;
                toast.success("Login Success!");
                navigate("/dashboard");
            }
        } catch (error: any) {
            if (error.response && error.response.status === 401) {
                toast.error("Email or password is incorrect!");
            } else {
                toast.error("Error: " + (error.response?.data.message || "Please try again."));
            }
        }
    };

    const isLoggedIn = () => {
        return !!token;
    };

    const logout = async () => {
        await Swal.fire({
            title: "Are you sure?",
            text: "Do you really want to log out?",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Logout",
        });
        toast.success("Logout Success!");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        setToken(null);
        navigate("/login");
    };

    const UserUpdateName = async (name: string) => {
        try {
            await UserUpdateNameAPI({ name });
            const updatedUser = { ...user, name } as UserProfile;
            setUser(updatedUser);
            localStorage.setItem("user", JSON.stringify(updatedUser));
            toast.success("User name updated successfully");
        } catch (error) {
            toast.error("Error updating user name");
        }
    };

    const UserUpdateEmail = async (email: string, password: string) => {
        try {
            await UserUpdateEmailAPI({ email, password });
            const updatedUser = { ...user, email } as UserProfile;
            setUser(updatedUser);
            localStorage.setItem("user", JSON.stringify(updatedUser));
            toast.success("User email updated successfully");
        } catch (error) {
            toast.warning(error.message || "Server Error");
        }
    };

    const UserUpdatePassword = async (current_password: string, new_password: string, new_password_confirmation: string) => {
        try {
            await UserUpdatePasswordAPI({ current_password, new_password, new_password_confirmation });
            toast.success("User password updated successfully");
        } catch (error) {
            toast.error("Error updating password");
        }
    };

    const UserUpdateAvatar = async (avatar: string) => {
        try {
            await UserUpdateAvatarAPI({ avatar });
            const updatedUser = { ...user, avatar } as UserProfile;
            setUser(updatedUser);
            localStorage.setItem("user", JSON.stringify(updatedUser));
            toast.success("Avatar updated successfully");
        } catch (error) {
            toast.error("Error updating avatar");
        }
    };

    return (
        <UserContext.Provider value={{
            loginUser,
            user,
            token,
            logout,
            isLoggedIn,
            registerUser,
            UserUpdateName,
            UserUpdateEmail,
            UserUpdatePassword,
            UserUpdateAvatar,
        }}>
            {isReady ? children : null}
        </UserContext.Provider>
    );
};

export const useAuth = () => React.useContext(UserContext);
