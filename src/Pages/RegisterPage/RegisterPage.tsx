import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as Yup from "yup";
import { useAuth } from '../../Context/useAuth';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

type Props = {}

type RegisterFormsInput = {
    email: string,
    name: string,
    password: string,
};

const validation = Yup.object().shape({
    email: Yup.string().email('Invalid email format').required("Email Is Required"),
    name: Yup.string().required("Name Is Required"),
    password: Yup.string().required("Email Is Required"),
})

export default function RegisterPage({ }: Props) {
    const { registerUser } = useAuth();
    const { register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormsInput>({ resolver: yupResolver(validation) })

    const handleRegister = (form: RegisterFormsInput) => {
        registerUser(form.email, form.name, form.password);
    }






    const { isLoggedIn } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (isLoggedIn()) {
            navigate('/dashboard', { state: { from: location }, replace: true });
        }
    }, [isLoggedIn, navigate, location]);

    return (

        // <>
        //     <div className="flex h-screen">
        //         <div className="w-1/2 flex flex-col justify-center items-center bg-white">
        //             <div className="text-center mb-8">
        //                 <h1 className="text-3xl font-bold">Sign In to Your Tasks</h1>
        //                 <p className="text-gray-600">Enter your Credentials to access your account</p>
        //             </div>

        //             <form className="w-80 space-y-6" onSubmit={handleSubmit(handleRegister)}>
        //                 <div>
        //                     <label htmlFor="email" className="sr-only">
        //                         Email
        //                     </label>
        //                     <input
        //                         type="email"
        //                         id="email"
        //                         placeholder="Your Email"
        //                         className="w-full px-4 py-2 border border-l-4 focus:ring-0 focus:border-gray-500 focus:border-l-blue-700 "
        //                         {...register("email")}
        //                     />

        //                     <label htmlFor="password" className="sr-only">
        //                         Password
        //                     </label>
        //                     <div className="relative">
        //                         <input
        //                             type="password"
        //                             id="password"
        //                             placeholder="Password"
        //                             className="w-full px-4 py-2 border border-l-4 border-t-0 focus:ring-0 focus:border-gray-500 focus:border-l-blue-700  "
        //                             {...register("password")}
        //                         />

        //                         <button
        //                             type="button"
        //                             className="absolute inset-y-0 right-3  flex items-center"
        //                         >
        //                             <i className="fa-solid fa-eye"></i>
        //                         </button>
        //                     </div>
        //                 </div>

        //                 <div className="flex items-center justify-between">
        //                     <label className="flex items-center">
        //                         <input
        //                             type="checkbox"
        //                         />
        //                         <span className="ml-2 text-gray-600">Remember Me</span>
        //                     </label>
        //                     <a href="#" className="text-sm text-blue-600 hover:underline">
        //                         Forgot Password?
        //                     </a>
        //                 </div>

        //                 <button
        //                     type="submit"
        //                     className="w-full bg-blue-100 text-white py-2 rounded-lg font-bold hover:bg-blue-300 transition-colors"
        //                 >
        //                     Login
        //                 </button>

        //                 <div className="flex justify-between mt-6 space-x-2">
        //                     <button className="flex items-center flex-grow border px-2 py-1 rounded-lg text-sm">
        //                         <i className="fa-brands fa-google"></i>
        //                         <span className="ml-2 whitespace-nowrap">Sign in with Google</span>
        //                     </button>
        //                     <button className="flex items-center flex-grow border px-2 py-1 rounded-lg text-sm">
        //                         <i className="fa-brands fa-github"></i>
        //                         <span className="ml-2 whitespace-nowrap">Sign in with GitHub</span>
        //                     </button>
        //                 </div>


        //                 <p className="text-sm text-center mt-6">
        //                     Don't have an account?{" "}
        //                     <Link to={"/register"} className="text-blue-600 hover:underline">
        //                         Sign Up
        //                     </Link>
        //                 </p>
        //             </form>
        //         </div>

        //         {/* Right Side */}
        //         <div className="w-1/2 bg-blue-100 flex items-center justify-center">
        //             <div className="bg-cover w-full h-full" style={{ backgroundImage: `url('/bgImage.jpg')` }}>

        //             </div>
        //         </div>
        //     </div>

        // </>

        <>
            <section >
                <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                    <div className="w-full bg-white rounded-lg shadow dark:border md:mb-20 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                                Sign in to your account
                            </h1>
                            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit(handleRegister)}>
                                <div>
                                    <label
                                        htmlFor="name"
                                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                    >
                                        name
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        placeholder="name"
                                        {...register("name")}
                                    />
                                    {errors.name ? <p>{errors.name.message}</p> : ""}
                                </div>
                                <div>
                                    <label
                                        htmlFor="email"
                                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                    >
                                        email
                                    </label>
                                    <input
                                        type="text"
                                        id="email"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        placeholder="email"
                                        {...register("email")}
                                    />
                                    {errors.email ? <p>{errors.email.message}</p> : ""}
                                </div>
                                <div>
                                    <label
                                        htmlFor="password"
                                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                    >
                                        Password
                                    </label>
                                    <input
                                        type="password"
                                        id="password"
                                        placeholder="••••••••"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        {...register("password")}
                                    />
                                    {errors.password ? <p>{errors.password.message}</p> : ""}
                                </div>

                                <button
                                    type="submit"
                                    className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                                >
                                    Sign in
                                </button>
                                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                                    Don’t have an account yet?{" "}
                                    <Link
                                        to={"/login"}
                                        className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                                    >
                                        Sign In
                                    </Link>
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}