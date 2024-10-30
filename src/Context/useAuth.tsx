import React, { createContext, useEffect, useState } from "react";
import { UserProfile } from "../Models/User";
import { useNavigate } from "react-router-dom";
import { loginAPI, RegisterAPI, UserAPI, UserUpdateAvatarAPI, UserUpdateEmailAPI, UserUpdateNameAPI, UserUpdatePasswordAPI } from "../Services/AuthService";
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
    //Update cuy
    UserUpdateName: (name: string) => Promise<void>
    UserUpdateEmail: (email: string, password: string) => Promise<void>
    UserUpdatePassword: (current_password: string, new_password: string, new_password_confirmation: string) => Promise<void>
    UserUpdateAvatar: (avatar: string) => Promise<void>
};

type Props = { children: React.ReactNode };

const UserContext = createContext<UserContextType>({} as UserContextType);

export const UserProvider = ({ children }: Props) => {
    const navigate = useNavigate();
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<UserProfile | null>(null);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const user = localStorage.getItem("user");
        const token = localStorage.getItem("token");

        // if (user && token) {
        if (token) {
            setUser(JSON.parse(user));
            setToken(token);
            axios.defaults.headers.common["Authorization"] = "Bearer " + token;
        }

        // Tambahkan interceptor untuk memeriksa token yang expired
        // const interceptor = axios.interceptors.response.use(
        //     (response) => response,
        //     async (error) => {
        //         const originalRequest = error.config;

        //         if (error.response && error.response.status === 401 && !originalRequest._retry) {
        //             originalRequest._retry = true;

        //             try {
        //                 const response = await axios.post("http://127.0.0.1:8000/api/auth/refresh");

        //                 const newToken = response.data.token;
        //                 localStorage.setItem("token", newToken);
        //                 setToken(newToken);
        //                 axios.defaults.headers.common["Authorization"] = "Bearer " + newToken;

        //                 originalRequest.headers["Authorization"] = "Bearer " + newToken;
        //                 return axios(originalRequest);
        //             } catch (err) {
        //                 toast.error("Session expired, please login again!");
        //                 localStorage.removeItem("token");
        //                 localStorage.removeItem("user");
        //                 setUser(null);
        //                 setToken(null);
        //                 navigate("/login");
        //                 return Promise.reject(err);
        //             }
        //         }

        //         return Promise.reject(error);
        //     }
        // );

        setIsReady(true);

        // return () => {
        //     axios.interceptors.response.eject(interceptor);
        // };
    }, [navigate]);

    const registerUser = async (email: string, name: string, password: string, password_confirmation: string) => {
        try {
            const res = await RegisterAPI(email, name, password, password_confirmation);
            if (res) {
                toast.success("Register Success!");
                navigate("/login");
            }
        } catch (error) {

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
                toast.success("Login Success!");
                navigate("/dashboard");
            }
        } catch (error) {
            if (error.status === 401) {
                toast.error("Email atau password salah!");
            } else {
                toast.error("Terjadi kesalahan: " + (error.data.message || "Silakan coba lagi."));
            }
        }
    };

    const isLoggedIn = () => {
        return !!token;
    };



    const logout = async () => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "Do you really want to log out?",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Logout'
        });

        if (result.isConfirmed) {
            try {
                toast.success("Logout Success!");
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                setUser(null);
                setToken("");
                navigate("/login");
            } catch (error) {
                toast.warning("Something Wrong!");
            }
        }
    };





    const UserProfile = async () => {
        try {
            // const res = await UserAPI();
            const user = localStorage.getItem("user");

            // Cek di sini struktur response
            setUser(user);
        } catch (error) {
            console.log(error); // Tambahkan untuk mengecek error
        }
    };

    useEffect(() => {
        if (!isLoggedIn()) return;
        UserProfile();
    }, []);


    const UserUpdateName = async (name: string) => {
        try {
            await UserUpdateNameAPI({ name });
            const user = localStorage.getItem("user");
            if (user) {
                const userObj = JSON.parse(user);
                userObj.name = name;

                localStorage.setItem("user", JSON.stringify(userObj));

                setUser(userObj);
            }
            toast.success("User name updated successfully");

        } catch (error) {
            toast.error("Error Update User name");
        }
    }

    const UserUpdateEmail = async (email: string, password: string) => {
        try {
            await UserUpdateEmailAPI({ email, password });
            const user = localStorage.getItem("user");
            if (user) {
                const userObj = JSON.parse(user);
                userObj.email = email;

                localStorage.setItem("user", JSON.stringify(userObj));

                setUser(userObj);
            }
            toast.success("User Email updated successfully");
        } catch (error) {
            toast.warning(error.message || "Server Error");
        }
    }

    const UserUpdatePassword = async (current_password: string, new_password: string, new_password_confirmation: string) => {
        try {
            await UserUpdatePasswordAPI({ current_password, new_password, new_password_confirmation })
            toast.success("User Password updated successfully");
        } catch (error) {
            toast.error("User Email updated Error");

        }
    }

    const UserUpdateAvatar = async (avatar: string) => {
        try {
            await UserUpdateAvatarAPI({ avatar })
            const user = localStorage.getItem("user");
            if (user) {
                const userObj = JSON.parse(user);
                userObj.avatar = avatar;

                localStorage.setItem("user", JSON.stringify(userObj));

                setUser(userObj);
            }
            toast.success("Avatar Berhasil Diupdate");
        } catch (error) {
            toast.error("Avatar gagal Diupdate");

        }
    }



    return (
        <UserContext.Provider value={{ loginUser, user, token, logout, isLoggedIn, registerUser, UserUpdateName, UserUpdateEmail, UserUpdatePassword, UserUpdateAvatar }}>
            {isReady ? children : null}
        </UserContext.Provider>
    );
};

export const useAuth = () => React.useContext(UserContext);