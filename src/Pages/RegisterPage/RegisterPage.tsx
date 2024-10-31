import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as Yup from "yup";
import { useAuth } from '../../Context/useAuth';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion'; // Import motion
import line from "../../assets/VELO/line.png"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import LogoGoogle from '../../assets/Google.png';
import LogoGithub from '../../assets/Github.png';
import LogoUtama from '../../assets/Logo.png';
import { toast } from 'react-toastify';

type Props = {}

type RegisterFormsInput = {
    email: string,
    name: string,
    password: string,
    password_confirmation: string,
};

const validation = Yup.object().shape({
    email: Yup.string().email('Invalid email format').required("Email is required"),
    name: Yup.string().required("Name is required"),
    password: Yup.string().required("Password is required").min(8, "Password must be at least 8 characters"),
    password_confirmation: Yup.string()
        .oneOf([Yup.ref('password')], 'Passwords must match')
        .required('Password confirmation is required'),
});

export default function RegisterPage({ }: Props) {
    const { registerUser } = useAuth();
    const { register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormsInput>({ resolver: yupResolver(validation) })

    const [isAgree, setIsAgree] = useState<boolean>(false);

    const handleRegister = (form: RegisterFormsInput) => {
        if (!isAgree) {
            toast.warning('You must agree to the terms and policy');
            return;
        }
        registerUser(form.email, form.name, form.password, form.password_confirmation);
    }

    const { isLoggedIn } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isPasswordConfirmVisible, setIsPasswordConfirmVisible] = useState(false);
    
    
    useEffect(() => {
        if (isLoggedIn()) {
            navigate('/dashboard', { state: { from: location }, replace: true });
        }
    }, [isLoggedIn, navigate, location]);

    const visible = () => {
        setIsPasswordVisible(!isPasswordVisible);
    }
    const visibleConfirm = () => {
        setIsPasswordConfirmVisible(!isPasswordConfirmVisible);
    }

    return (
        <AnimatePresence>
            <div
                className="min-h-screen flex overflow-hidden "

            >
                <motion.div
                    initial={{ opacity: 0, x: 1000 }}
                    animate={{ opacity: 1000, x: 0 }}
                    exit={{ opacity: 0, x: -1000 }}
                    transition={{ duration: 1.5, }}
                    className="w-1/2 flex flex-col justify-center items-center bg-white">
                    <img src={LogoUtama} alt="Logo" className="max-w-[150px]" />
                    <h1 className="text-4xl font-bold mb-2">
                        Welcome To <span className="text-[#7ecd50]">V</span>
                        <span className="text-[#54afe5]">E</span>
                        <span className="text-rose-500">L</span>
                        <span className="text-amber-400">O</span>
                    </h1>
                    <p className="font-semibold text-sm mb-6">Start Organizing and Collaborating</p>
                    <form onSubmit={handleSubmit(handleRegister)} className="w-3/4">
                        <div className="absolute w-1 z-10 bg-[#7ecd50]" style={{ height: '15.3rem' }}></div>
                        <div className="mb-0 border border-gray-300 rounded-t px-5">
                            <label className="text-sm text-gray-600">Your Name</label>
                            <div className="flex items-center">
                                <span className="text-base text-[#7ecd50] -mt-2 mr-2">|</span>
                                <input
                                    type="text"
                                    {...register("name")}
                                    className="w-full text-sm border-none rounded focus:outline-none focus:border-lime-500"
                                    required
                                />
                            </div>
                        </div>

                        <div className="mb-0 border border-gray-300 px-5">
                            <label className="text-sm text-gray-600">Your Email</label>
                            <div className="flex items-center">
                                <span className="text-base text-[#7ecd50] -mt-2 mr-2">|</span>
                                <input
                                    type="email"
                                    {...register("email")}
                                    className="w-full text-sm border-none rounded focus:outline-none focus:border-lime-500"
                                    required
                                />
                            </div>
                        </div>

                        <div className="mb-0 relative border border-gray-300 px-5">
                            <label className="text-sm text-gray-600">Your Password</label>
                            <div className="flex items-center">
                                <span className="text-base text-[#7ecd50] -mt-2 mr-2">|</span>
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
                        </div>

                        <div className="mb-0 relative border border-gray-300 px-5">
                            <label className="text-sm text-gray-600">Confirm Password</label>
                            <div className="flex items-center">
                                <span className="text-base text-[#7ecd50] -mt-2 mr-2">|</span>
                                <input
                                    type={isPasswordConfirmVisible ? 'text' : 'password'}
                                    {...register("password_confirmation")}
                                    className="w-full text-sm border-none rounded focus:outline-none focus:border-lime-500"
                                    required
                                />
                                <FontAwesomeIcon
                                    icon={isPasswordConfirmVisible ? faEyeSlash : faEye}
                                    className="relative ml-4 -mt-4 text-gray-500 cursor-pointer"
                                    size="lg"
                                    onClick={visibleConfirm}
                                />
                            </div>
                        </div>
                        {errors.name && <p className="text-red-500">{errors.name.message}</p>}
                        {errors.email && <p className="text-red-500">{errors.email.message}</p>}
                        {errors.password && <p className="text-red-500">{errors.password.message}</p>}
                        {errors.password_confirmation && <p className="text-red-500">{errors.password_confirmation.message}</p>}

                        <div className="mb-4 flex justify-center mt-2 -mx-2 items-center">
                            <input
                                type="checkbox"
                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded"
                                onChange={()    => setIsAgree(!isAgree)}
                            />
                            <label htmlFor="terms" className="text-gray-600 ml-2">I Agree to the terms & policy</label>
                        </div>

                        <button
                            type="submit"
                            className="w-4/5 text-lg py-1 font-bold rounded-full mx-12 shadow transition duration-200 ease-in-out bg-lime-500 text-white hover:bg-lime-600"
                        >
                            Register
                        </button>

                        <div className="flex items-center my-4">
                            <hr className="flex-grow border-gray-300" />
                            <span className="mx-2 text-gray-500">Or</span>
                            <hr className="flex-grow border-gray-300" />
                        </div>

                        <div className="flex justify-between mb-6 mt-7">
                            <button className="flex justify-center items-center font-semibold border border-gray-300 p-1 rounded-full w-1/2 mr-2 hover:bg-gray-100 transition duration-200 ease-in-out text-xs">
                                <img src={LogoGoogle} alt="Google logo" className="mr-1 max-w-[20px]" />
                                Sign in with Google
                            </button>
                            <button className="flex justify-center items-center font-semibold border border-gray-300 p-1 rounded-full w-1/2 ml-2 hover:bg-gray-100 transition duration-200 ease-in-out text-xs">
                                <img src={LogoGithub} alt="GitHub logo" className="mr-1 max-w-[20px]" />
                                Sign in with GitHub
                            </button>
                        </div>
                        <p className="text-center mt-4 font-medium text-sm">Have an account? <a href="/login" className="text-blue-500">Sign In</a></p>
                    </form>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, x: -1000 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 1000 }}
                    transition={{ duration: 1.5 }}
                    className="relative hidden md:block w-1/2 bg-[#7ecd50] bg-cover bg-center"
                >
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{
                            backgroundImage: `url(${line})`,
                            opacity: 0.1,
                            zIndex: 0
                        }}
                    ></div>
                </motion.div>

               
            </div>
        </AnimatePresence>
    );
}
