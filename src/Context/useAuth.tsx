import React, { createContext, useEffect, useState } from "react";
import { UserProfile } from "../Models/User"
import { useNavigate } from "react-router-dom";
import { loginAPI, RegisterAPI } from "../Services/AuthService";
import { toast } from "react-toastify";
import axios from "axios";

type UserContextType = {
    user: UserProfile | null;
    token: string | null;
    registerUser: (email: string, name: string, password: string) => void;
    loginUser: (email: string, password: string) => void;
    logout: () => void;
    isLoggedIn: () => boolean;
}

type Props = { children: React.ReactNode };

const UserContext = createContext<UserContextType>({} as UserContextType);

export const UserProvider = ({ children }: Props) => {
    const navigate = useNavigate();
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<UserProfile | null>(null);
    const [isReady, setIsReady] = useState(false);

    useEffect(
        () => {
            const user = localStorage.getItem("user");
            const token = localStorage.getItem("token");
            if (user && token) {
                setUser(JSON.parse(user));
                setToken(token);
                axios.defaults.headers.common["Authorization"] = "Bearer " + token;
            }
            setIsReady(true);
        }, []
    )

    const registerUser = async (email: string, name: string, password: string) => {
        await RegisterAPI(email, name, password).then((res) => {
            if (res) {
                toast.success("Register Success!")
                navigate("/login")
            }
        }).catch((e) => toast.warning("Server Error"))
    };

    const loginUser = async (email: string, password: string) => {
        await loginAPI(email, password).then((res) => {
            if (res) {
                localStorage.setItem("token", res?.data.token);
                const userObj = {
                    name: res?.data.user.name,
                    email: res?.data.user.email,
                }
                console.log()
                console.log(userObj);
                localStorage.setItem("user", JSON.stringify(userObj));
                setToken(res?.data.token!);
                setUser(userObj!);
                toast.success("Login Success!")
                navigate("/dashboard")
            }
        }).catch((e) => toast.error("Login Error"))
    };

    const isLoggedIn = () => {
        return !!user;
    };

    const logout = () => {
        toast.success("Logout Success!")
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        setToken("");
        navigate("/login")
    }

    return (
        <UserContext.Provider value={{ loginUser, user, token, logout, isLoggedIn, registerUser }} >
            {isReady ? children : null}
        </UserContext.Provider>
    )
}

export const useAuth = () => React.useContext(UserContext);