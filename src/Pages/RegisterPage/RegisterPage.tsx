import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as Yup from "yup";
import { useAuth } from '../../Context/useAuth';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import VELO_DEFAULT from '../../assets/VELO _ DEFAULT.png';
import { AnimatePresence, motion } from 'framer-motion'; // Import motion
import line from "../../assets/VELO/line.png"

type Props = {}

type RegisterFormsInput = {
    email: string,
    name: string,
    password: string,
    password_confirmation: string,
};

const validation = Yup.object().shape({
    email: Yup.string().email('Invalid email format').required("Email Is Required"),
    name: Yup.string().required("Name Is Required"),
    password: Yup.string().required("Password Is Required").min(8, "Password must be at least 8 characters"),
    password_confirmation: Yup.string()
        .oneOf([Yup.ref('password')], 'Passwords must match')
        .required('Password confirmation is required'),
})

export default function RegisterPage({ }: Props) {
    const { registerUser } = useAuth();
    const { register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormsInput>({ resolver: yupResolver(validation) })

    const handleRegister = (form: RegisterFormsInput) => {
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
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -1000 }}
                    transition={{ duration: 1 }}
                    className="relative hidden md:block w-1/2 bg-[#7ecd50] bg-cover bg-center"
                >
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{
                            backgroundImage: `url(${line})`,
                            opacity: 0.2,
                            zIndex: 0
                        }}
                    ></div>
                </motion.div>



                <motion.div
                    initial={{ opacity: 0, x: -1000 }}
                    animate={{ opacity: 1000, x: 0 }}
                    exit={{ opacity: 0, x: 1000 }}
                    transition={{ duration: 2, }}
                    className="w-full md:w-1/2 flex items-center justify-center min-h-screen bg-white">
                    <div className="w-full max-w-xl ">
                        <div className="flex justify-center mb-4">
                            <img src={VELO_DEFAULT} alt="Logo" className="w-56" />
                        </div>

                        <h2 className="text-4xl font-bold text-center text-black w-full">Welcome To
                            <span className='text-[#7ecd50]' > V</span>
                            <span className='text-[#54afe5]'>E</span>
                            <span className='text-[#f1487a]' >L</span>
                            <span className='text-[#fbcb41]'>O</span></h2>
                        <p className="text-center text-1xl font-bold text-gray-500 mt-3">Strat Organizing and Collaborating</p>

                        <form className="mt-6 w-[35rem]" onSubmit={handleSubmit(handleRegister)}>
                            <div className="border border-gray-400 border-b-0 border-l-[#7ecd50] border-l-4 px-4 py-1 mx-auto">
                                <p>Your Name</p>
                                <div className="flex">
                                    <div className="border-l-2 border-green-500 h-5 mt-1 mr-2"></div>
                                    <input
                                        type="text"
                                        className="block w-full px-2 py-1 border-none focus:outline-none focus:ring-0 focus:border-none"
                                        {...register("name")}
                                    />
                                </div>
                                {errors.name && <p className="text-red-500">{errors.name.message}</p>}
                            </div>

                            <div className="border border-gray-400 border-b-0 border-l-[#7ecd50] border-l-4 px-4 py-1 mx-auto">
                                <p>Your Email</p>
                                <div className="flex">
                                    <div className="border-l-2 border-green-500 h-5 mt-1 mr-2"></div>
                                    <input
                                        type="email"
                                        className="block w-full px-2 py-1 border-none focus:outline-none focus:ring-0 focus:border-none"
                                        {...register("email")}
                                    />
                                </div>
                                {errors.email && <p className="text-red-500">{errors.email.message}</p>}
                            </div>

                            <div className="border border-gray-400 border-l-4 border-b-0 border-l-[#7ecd50] px-4 py-1  mx-auto">
                                <p>Your Password</p>
                                <div className="relative">
                                    <div className="flex">
                                        <div className="border-l-2 border-green-500 h-5 mt-1 mr-2"></div>
                                        <input
                                            type={isPasswordVisible ? 'text' : 'password'}
                                            className="block w-full px-2 py-1 border-none focus:outline-none focus:ring-0 focus:border-none"
                                            {...register("password")}
                                        />
                                        <i onClick={visible} className={`w-9 fa-solid ${isPasswordVisible ? 'fa-eye-slash' : 'fa-eye'} cursor-pointer`}></i>
                                    </div>
                                    {errors.password && <p className="text-red-500">{errors.password.message}</p>}
                                </div>
                            </div>

                            <div className="border border-gray-400 border-l-4 border-l-[#7ecd50] px-4 py-1  mx-auto">
                                <p>Your Password Confirmation</p>
                                <div className="relative">
                                    <div className="flex">
                                        <div className="border-l-2 border-green-500 h-5 mt-1 mr-2"></div>
                                        <input
                                            type={isPasswordConfirmVisible ? 'text' : 'password'}
                                            className="block w-full px-2 py-1 border-none focus:outline-none focus:ring-0 focus:border-none"
                                            {...register("password_confirmation")}
                                        />
                                        <i onClick={visibleConfirm} className={`w-9 fa-solid ${isPasswordConfirmVisible ? 'fa-eye-slash' : 'fa-eye'} cursor-pointer`}></i>
                                    </div>
                                    {errors.password_confirmation && <p className="text-red-500">{errors.password_confirmation.message}</p>}
                                </div>
                            </div>

                            {/* <div className="flex justify-between items-center mt-4">
                            <label className="flex items-center text-sm text-gray-500">
                                <input type="checkbox" className="form-checkbox" />
                                <span className="ml-2">Remember Me</span>
                            </label>
                            <a href="#" className="text-sm text-green-600 hover:underline">
                                Forgot Password?
                            </a>
                        </div> */}
                            <label className="flex items-center  justify-center text-sm text-gray-500 mt-5">
                                <input type="checkbox" className="form-checkbox" />
                                <span className="ml-2">I Agree to the terms & policy</span>
                            </label>

                            <div className="text-center mt-6">
                                <button type="submit"
                                    className="w-[30rem] bg-[#7ecd50] text-white py-2 px-4 rounded-[20rem] hover:bg-green-400">
                                    Register
                                </button>
                            </div>

                            {/* <div className="flex justify-center my-5">
                            <p>OR</p>
                        </div>

                        <div className="flex justify-between space-x-2 ">
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
                        </div> */}


                        </form>

                        <p className="mt-4 text-center text-sm text-gray-500">
                            have an account?{' '}
                            <Link to="/login" className="text-[#7ecd50] hover:underline">
                                Login
                            </Link>
                        </p>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
