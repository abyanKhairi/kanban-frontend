import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as Yup from "yup";
import { useAuth } from '../../Context/useAuth';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import VELO_DEFAULT from '../../assets/VELO _ DEFAULT.png';
import { AnimatePresence, motion } from 'framer-motion';
import line from "../../assets/VELO/line.png"

type Props = {}

type LoginFormsInput = {
    email: string,
    password: string,
};

const validation = Yup.object().shape({
    email: Yup.string().email('Invalid email format').required("Email is required"),
    password: Yup.string().required("Password is required"),
})

function LoginPage({ }: Props) {
    const { loginUser } = useAuth();
    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormsInput>({ resolver: yupResolver(validation) })
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);


    const handleLogin = (form: LoginFormsInput) => {
        loginUser(form.email, form.password);
    }

    const { isLoggedIn } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (isLoggedIn()) {
            navigate('/dashboard', { state: { from: location }, replace: true });
        }
    }, [isLoggedIn, navigate, location]);

    const visible = () => {
        setIsPasswordVisible(!isPasswordVisible);

    }

    return (
        <AnimatePresence>
            <div
                className="min-h-screen flex overflow-hidden">
                <motion.div
                    initial={{ opacity: 0, x: 1000 }}
                    animate={{ opacity: 800, x: 0 }}
                    exit={{ opacity: 0, x: -1000 }}
                    transition={{ duration: 1 }}
                    className="w-full md:w-1/2 flex items-center justify-center min-h-screen bg-white">
                    <div className="w-full max-w-xl ">
                        <div className="flex justify-center  mb-4">
                            <img src={VELO_DEFAULT} alt="Logo" className="w-56" />
                        </div>

                        <h2 className="text-4xl font-bold text-center text-black w-full">Sign In to Your Tasks</h2>
                        <p className="text-center text-1xl font-bold text-gray-500 mt-3">Enter your Credentials to access your account</p>

                        <form className="mt-6 w-[35rem]" onSubmit={handleSubmit(handleLogin)}>
                            <div className="border border-gray-400 border-b-0 border-l-[#54afe5] border-l-4 px-4 py-1  mx-auto">
                                <p>Your Email</p>
                                <div className="flex">
                                    <div className="border-l-2 border-blue-500 h-5 mt-1 mr-2"></div> {/* Garis vertikal */}
                                    <input
                                        type="email"
                                        className="block w-full px-2 py-1 border-none focus:outline-none focus:ring-0 focus:border-none"
                                        {...register("email")}
                                    />
                                </div>
                                {errors.email && <p className="text-red-500">{errors.email.message}</p>}
                            </div>

                            <div className="border border-gray-400 border-l-4 border-l-[#54afe5] px-4 py-1  mx-auto">
                                <p>Your Password</p>
                                <div className="relative">
                                    <div className="flex">
                                        <div className="border-l-2 border-blue-500 h-5 mt-1 mr-2"></div> {/* Garis vertikal */}
                                        <input
                                            type={isPasswordVisible ? 'text' : 'password'}
                                            className="block w-full px-2 py-1 border-none focus:outline-none focus:ring-0 focus:border-none"
                                            {...register("password")}
                                        />
                                        <i onClick={visible} className={`w-9 fa-solid ${isPasswordVisible ? 'fa-eye-slash' : 'fa-eye'} cursor-pointer`}></i> {/* Ikon mata */}
                                    </div>
                                    {errors.password && <p className="text-red-500">{errors.password.message}</p>}
                                </div>
                            </div>

                            <div className="flex justify-between items-center mt-4">
                                <label className="flex items-center text-sm text-gray-500">
                                    <input type="checkbox" className="form-checkbox" />
                                    <span className="ml-2">Remember Me</span>
                                </label>
                                <a href="#" className="text-sm text-blue-600 hover:underline">
                                    Forgot Password?
                                </a>
                            </div>

                            <div className="text-center mt-6">
                                <button type="submit"
                                    className="w-[30rem]  bg-[#54afe5] text-white py-2 px-4 rounded-[20rem] hover:bg-blue-400"> {/* Memperpanjang tombol */}
                                    Login
                                </button>
                            </div>

                            <div className="flex justify-between space-x-2 mt-8">
                                <button type="button"
                                    className="flex gap-3 items-center justify-center w-1/2 py-1 px-3 border border-gray-300 rounded-[20rem] bg-white text-gray-700 hover:bg-gray-50">
                                    <i className="fa-brands fa-google"></i>
                                    Google
                                </button>
                                <button type="button"
                                    className="flex gap-3 items-center justify-center w-1/2 py-1 px-3 border border-gray-300 rounded-[20rem] bg-white text-gray-700 hover:bg-gray-50">
                                    <i className="fa-brands fa-github"></i>
                                    GitHub
                                </button>
                            </div>
                        </form>

                        <p className="mt-4 text-center text-sm  text-gray-500">
                            Don’t have an account?{' '}
                            <Link to="/register" className="text-[#54afe5] hover:underline">
                                Sign Up
                            </Link>
                        </p>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: -1000 }}
                    animate={{ opacity: 1000, x: 0 }}
                    exit={{ opacity: 0, x: 1000 }}
                    transition={{ duration: 2, }}
                    className="hidden md:block w-1/2 bg-[#54afe5] relative  bg-cover bg-center">
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{
                            backgroundImage: `url(${line})`,
                            opacity: 0.2,
                            zIndex: 0
                        }}
                    ></div>
                </motion.div>
            </div>
        </AnimatePresence>
    );


}

export default LoginPage;
