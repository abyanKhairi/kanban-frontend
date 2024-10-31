import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as Yup from "yup";
import { useAuth } from '../../Context/useAuth';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import line from "../../assets/VELO/line.png"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import LogoGoogle from '../../assets/Google.png';
import LogoGithub from '../../assets/Github.png';
import LogoUtama from '../../assets/Logo.png';

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
                    animate={{ opacity: 1000, x: 0 }}
                    exit={{ opacity: 0, x: -1000 }}
                    transition={{ duration: 1.5, }}
                    className="hidden md:block w-1/2 bg-[#54afe5] relative  bg-cover bg-center">
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{
                            backgroundImage: `url(${line})`,
                            opacity: 0.1,
                            zIndex: 0
                        }}
                    ></div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: -1000 }}
                    animate={{ opacity: 800, x: 0 }}
                    exit={{ opacity: 0, x: 1000 }}
                    transition={{ duration: 1.5 }}
                    className="w-1/2 flex flex-col justify-center items-center bg-white">
                <img src={LogoUtama} alt="Logo" className="max-w-[150px] mb-1 -mt-10" />
                <h1 className="text-4xl font-bold mb-2">Sign In to Your Tasks</h1>
                <p className="mb-6 text-sm font-semibold">Enter your credentials to access your account</p>
                
                <div className="w-3/4">
                    <form onSubmit={handleSubmit(handleLogin)}>
                        <div className="absolute z-10 w-1 bg-[#54afe5]" style={{ height: '7.675rem' }}></div> 
                        <div className="mb-0 border border-gray-300 rounded-t px-5">
                            <label className="text-sm text-gray-600">Your Email</label>
                            <div className="flex items-center">
                                <span className="text-base text-[#54afe5] -mt-2 mr-2">|</span>
                                <input
                                    type="email"
                                    {...register("email")}
                                    className="w-full text-sm border-none rounded focus:outline-none focus:border-lime-500"
                                    required
                                />
                            </div>
                            {errors.email ? <p className="text-red-500 text-xs mt-1">{errors.email.message}</p> : ""}
                        </div>

                        <div className="mb-0 relative border border-gray-300 rounded-b px-5">
                            <label className="text-sm text-gray-600">Your Password</label>
                            <div className="flex items-center">
                                <span className="text-base text-[#54afe5] -mt-2 mr-2">|</span>
                                <input
                                    type={isPasswordVisible ? 'text' : 'password'}
                                    {...register("password")}
                                    className="w-full text-sm border-none rounded focus:outline-none focus:border-lime-500"
                                    required
                                />
                                <FontAwesomeIcon
                                    icon={isPasswordVisible ? faEyeSlash : faEye}
                                    className="relative ml-4 -mt-4 text-gray-500 cursor-pointer"
                                    size="lg"
                                    onClick={visible}
                                />
                            </div>
                            {errors.password ? <p className="text-red-500 text-xs mt-1">{errors.password.message}</p> : ""}
                        </div>

                        <div className="flex justify-between items-center mb-7 mt-3">
                            <label className="flex text-base items-center text-gray-500">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 mr-2 text-blue-600 bg-gray-100 border-gray-300 rounded"
                                />
                                Remember Me
                            </label>
                            <a href="#" className="text-gray-500 text-base">Forgot Password?</a>
                        </div>
                        <button type="submit" className="w-4/5 bg-[#54afe5] text-lg py-1 font-bold text-white rounded-full mx-12 shadow hover:bg-blue-700 transition duration-200 ease-in-out">
                            Login
                        </button>
                    </form>

                    <div className="flex justify-between mb-10 mt-7">
                        <button className="flex justify-center items-center font-semibold border border-gray-300 p-1 rounded-full w-1/2 mr-2 hover:bg-gray-100 transition duration-200 ease-in-out text-xs">
                            <img src={LogoGoogle} alt="Google logo" className="mr-1 max-w-[20px]" />
                            Sign in with Google
                        </button>
                        <button className="flex justify-center items-center font-semibold border border-gray-300 p-1 rounded-full w-1/2 ml-2 hover:bg-gray-100 transition duration-200 ease-in-out text-xs">
                            <img src={LogoGithub} alt="GitHub logo" className="mr-1 max-w-[20px]" />
                            Sign in with GitHub
                        </button>
                    </div>
                    <p className="text-center font-medium text-sm animate-bounce">Don't have an account? <a href="/register" className="text-[#54afe5]">Sign Up</a></p>
                </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );


}

export default LoginPage;
