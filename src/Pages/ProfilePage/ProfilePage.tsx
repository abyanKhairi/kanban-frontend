import React, { useState } from "react";
import { useAuth } from "../../Context/useAuth";
import * as Yup from "yup";
import { toast } from "react-toastify";
import avatar1 from '../../assets/avatar/avatar.png';
import avatar6 from '../../assets/avatar/avatar6.png';
import avatar3 from '../../assets/avatar/avatar3.png';
import avatar4 from '../../assets/avatar/avatar4.png';
import avatar5 from '../../assets/avatar/avatar5.png';
import { useBoardContext } from "../../Context/useBoard";
import { Label, TextInput } from "flowbite-react";
import line from "../../assets/VELO/line.png"

type Props = {};

export default function ProfilePage({ }: Props) {
    const { user, UserUpdateName, UserUpdateEmail, UserUpdatePassword, UserUpdateAvatar } = useAuth();

    const { fourBoard } = useBoardContext();

    const [name, setName] = useState(user.name);
    const nameSchema = Yup.string().required("Name is required");
    const handleUpdateName = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await nameSchema.validate(name);
            await UserUpdateName(name);
            setFormName(false);
            setFormEmail(false)
            setFormPassword(false)
            setFormAvatar(false)
            setDropdownOpen(false)
        } catch (error) {
            if (error instanceof Yup.ValidationError) {
                toast.error(error.message);
            } else {
                console.error("Error updating name", error);
                toast.error("Error updating name");
            }
        }
    };


    const [email, setEmail] = useState(user.email);
    const [password, setPassword] = useState("");
    const emailSchema = Yup.string().email("Invalid email").required("Email is required");
    const passwordSchema = Yup.string().required("Current password is required");
    const handleUpdateEmail = async (e: React.FormEvent) => {
        e.preventDefault(); // Prevent default form behavior
        try {
            await emailSchema.validate(email); // Validate email
            await passwordSchema.validate(password); // Validate password
            await UserUpdateEmail(email, password);
            // toast.success("Email updated successfully!");
            setFormName(false);
            setFormEmail(false)
            setFormPassword(false)
            setFormAvatar(false)
            setDropdownOpen(false)
        } catch (error) {
            if (error instanceof Yup.ValidationError) {
                toast.error(error.message);
            } else {
                console.error("Error updating email", error);
                toast.error("Error updating email");
            }
        }
    };



    const [current_password, setCurrent_Password] = useState("");
    const [new_password, setNew_Password] = useState("");
    const [new_password_confirmation, setNew_Password_confirmation] = useState("");
    const passwordValidationSchema = Yup.object().shape({
        current_password: Yup.string().required("Current password is required"),
        new_password: Yup.string().min(8, "New password must be at least 8 characters").required("New password is required"),
        new_password_confirmation: Yup.string()
            .oneOf([Yup.ref('new_password'), null], "Passwords must match")
            .required("Password confirmation is required"),
    });

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await passwordValidationSchema.validate({
                current_password,
                new_password,
                new_password_confirmation,
            });
            await UserUpdatePassword(current_password, new_password, new_password_confirmation); // Call API to update password
            toast.success("Password changed successfully!");
            setFormName(false);
            setFormEmail(false)
            setFormPassword(false)
            setFormAvatar(false)
            setDropdownOpen(false)
        } catch (error) {
            if (error instanceof Yup.ValidationError) {
                toast.error(error.message); // Show validation error message
            } else {
                console.error("Error updating password", error);
                toast.error("Error updating password"); // Handle API error
            }
        }
    };


    const [avatar, setAvatar] = useState(user.avatar)
    const handleUpdateAvatar = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await UserUpdateAvatar(avatar)
            setFormName(false);
            setFormEmail(false)
            setFormPassword(false)
            setFormAvatar(false)
            setDropdownOpen(false)
        } catch (error) {
            toast.error("Error updating Avatar");
        }
    }

    const avatars = [
        { name: 'avatar.png', src: avatar1, title: "VELO" },
        { name: 'avatar6.png', src: avatar6, title: "BLACK MAN" },
        { name: 'avatar3.png', src: avatar3, title: "GLASSES" },
        { name: 'avatar4.png', src: avatar4, title: "INDIAN MAN" },
        { name: 'avatar5.png', src: avatar5, title: "GOOD MAN" },
    ];



    const [formName, setFormName] = useState(false);
    const [formEmail, setFormEmail] = useState(false);
    const [formPassword, setFormPassword] = useState(false);
    const [formAvatar, setFormAvatar] = useState(false);


    const showFormName = () => {
        setFormName(true);
        setFormEmail(false)
        setFormPassword(false)
        setFormAvatar(false)
        setDropdownOpen(false)
        setAvatar(user.avatar)
    }
    const showFormEmail = () => {
        setFormName(false);
        setFormEmail(true)
        setFormPassword(false)
        setFormAvatar(false)
        setDropdownOpen(false)
        setAvatar(user.avatar)
    }
    const showFormPassword = () => {
        setFormName(false);
        setFormEmail(false)
        setFormPassword(true)
        setFormAvatar(false)
        setDropdownOpen(false)
        setAvatar(user.avatar)
    }

    const showFormAvatar = () => {
        setFormName(false);
        setFormEmail(false)
        setFormPassword(false)
        setFormAvatar(true)
        setDropdownOpen(false)
        setAvatar(user.avatar)
    }


    const [isDropdownOpen, setDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setDropdownOpen((prev) => !prev);

    };

    const profile = () => {
        setFormName(false);
        setFormEmail(false)
        setFormPassword(false)
        setFormAvatar(false)
        setDropdownOpen(false)
        setAvatar(user.avatar)
    }

    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const visible = () => {
        setIsPasswordVisible(!isPasswordVisible);

    }


    return (


        <div className="container px-6 pt-9 relative">
            <div className="relative w-full h-28 rounded-t-lg">
                <div
                    className="absolute z-10 top-0 left-0 w-full h-full rounded-t-lg bg-cover bg-center"
                    style={{
                        backgroundImage: `url(${line})`,
                        opacity: 0.1,
                    }}
                />
                <div className="absolute top-0 left-0 w-full h-full rounded-t-lg bg-[#0095FF] " />
                <div className="bg-[#FBF8F8] rounded-lg gap-8 pb-54 shadow-lg p-6">
                    <div className="flex ml-12 items-center mb-14 ">
                        <div className=" flex z-10">

                            <img

                                src={`/src/assets/avatar/` + avatar}
                                alt="User"
                                className={`w-48 h-48 shadow-lg rounded-full bg-white shadow-[#0095FF]  mt-8  mr-6 z-10 ${formEmail ? 'mt-[10px]' : ''} ${formPassword ? '-mt-[92px]' : ''} `}
                            />

                            <form
                                className={`${formAvatar ? 'block mt-10' : 'hidden'}`}
                                onSubmit={handleUpdateAvatar}
                            >
                                <div className="space-y-6 text-center items-center justify-center">
                                    <h1 className="text-2xl font-bold   text-gray-100 rounded-full bg-[#0095FF] dark:text-white">Element Bender</h1>
                                    <div className="flex flex-wrap space-x-4  justify-center">
                                        {avatars.map((avatarImage, index) => (
                                            <div key={index} className="flex flex-col items-center">
                                                <img
                                                    src={avatarImage.src}
                                                    alt={avatarImage.name}
                                                    className={`w-20 h-20 rounded-full cursor-pointer ${avatar === avatarImage.name ? 'border-[3px] border-blue-700' : 'border-2 border-blue-300'}`}
                                                    onClick={() => setAvatar(avatarImage.name)}
                                                />
                                                <Label htmlFor={`avatar${index + 1}`}>{avatarImage.title}</Label>
                                            </div>
                                        ))}
                                    </div>
                                    <button
                                        type="submit"
                                        className="py-1 px-4 mx-auto flex bg-blue-500 text-white rounded hover:bg-blue-600"
                                    >
                                        Update Avatar
                                    </button>
                                </div>
                            </form>
                        </div>
                        <div className={`z-10 mt-[5rem] ${formAvatar ? 'hidden' : 'block'} `} >
                            <h2
                                className={`${formName ? 'hidden' : 'block'} ${formEmail ? 'mt-[39px]' : ''} ${formPassword ? 'mt-[39px]' : ''} text-2xl font-bold`}
                                style={{ minHeight: '38px' }}
                            >
                                {user.name}
                            </h2>
                            <form
                                className={`${formName ? 'block mt-[2px]' : 'hidden'}`}
                                onSubmit={handleUpdateName}
                            >
                                {/* <h3 className="text-xl font-medium text-gray-900 dark:text-white">Change Your Name</h3> */}
                                <div className="flex gap-4 items-center">
                                    <input
                                        id="boardName"
                                        className="text-2xl font-bold py-1 px-2 -mt-[6px] -ml-[8.7px] border border-gray-300 rounded"
                                        type="text"
                                        value={name}
                                        autoFocus
                                        autoComplete="off"
                                        onChange={(e) => setName(e.target.value)}
                                        style={{ minHeight: '40px' }}
                                    />
                                    <button
                                        type="submit"
                                        className="py-1 px-4 bg-blue-500 text-white rounded mb-1 hover:bg-blue-600"
                                    >
                                        Update Name
                                    </button>
                                </div>
                            </form>

                            <form
                                className={`${formPassword ? 'block' : 'hidden'} z-10 `}
                                onSubmit={handleUpdatePassword}>
                                <div className="space-y-2">
                                    <div className="grid  gap-3">
                                        <div className="">

                                            <label htmlFor="currentPassword" className="font-semibold">Current Password</label>
                                            <div>
                                                <input
                                                    className="py-2 px-4 border border-gray-300 rounded"
                                                    id="currentPassword" type="password" placeholder="Current Password" value={current_password} onChange={(e) =>
                                                        setCurrent_Password(e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        <div className="gap-2 flex">
                                            <div className="mb-2 grid">
                                                <label htmlFor="currentPassword" className="font-semibold" >New Password</label>
                                                <input
                                                    className="py-2 px-4 border border-gray-300 rounded"
                                                    id="newPassword" type="password" placeholder="New Password" value={new_password} onChange={(e) =>
                                                        setNew_Password(e.target.value)}
                                                />
                                            </div>
                                            <div className="mb-2 grid">
                                                <label htmlFor="currentPassword" className="font-semibold">Confirm Password</label>
                                                <input
                                                    className="py-2 px-4 border border-gray-300 rounded"
                                                    id="passwordConfirmation" placeholder="Confirm New Password" type="password" value={new_password_confirmation}
                                                    onChange={(e) => setNew_Password_confirmation(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <button type="submit" className="py-1 px-4 mx-auto flex bg-blue-500 text-white rounded hover:bg-blue-600">Change Password</button>
                                </div>
                            </form>



                            <p
                                className={`${formEmail ? 'hidden' : 'block'} ${formPassword ? 'hidden' : 'block'} ${formName ? 'mt-[0.75px]' : ''} text-gray-600 text-xl `}>{user.email}</p>

                            <form
                                className={`${formEmail ? 'block' : 'hidden'}`}
                                onSubmit={handleUpdateEmail}
                            >
                                <div className="flex gap-2 -ml-[0.8rem] -mt-[0.27rem]">
                                    <div>
                                        <input
                                            id="email"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="text-xl py-1 px-3 border border-gray-300 rounded w-full"
                                            autoFocus
                                            autoComplete="off"
                                            placeholder="Enter new email"
                                        />
                                    </div>

                                    <div className="relative">
                                        <input
                                            id="password"
                                            type={isPasswordVisible ? 'text' : 'password'}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="text-xl py-1 px-4 border border-gray-300 rounded w-full pr-10"
                                            autoComplete="off"
                                            placeholder="Enter password"
                                        />
                                        <i
                                            onClick={visible}
                                            className={`absolute right-3 top-1/2 transform -translate-y-1/2 fa-solid ${isPasswordVisible ? 'fa-eye-slash' : 'fa-eye'} cursor-pointer`}
                                        ></i>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="mt-4 py-2 px-6 bg-blue-500 text-white rounded hover:bg-blue-600"
                                >
                                    Update Email
                                </button>
                            </form>
                        </div>

                        <button onClick={toggleDropdown}
                            className="w-12 h-12 ml-auto mt-12 mr-16 z-10 flex items-center justify-center text-white bg-[#54afe5] rounded-full hover:bg-blue-500">
                            <i className="  fas fa-edit"></i>
                        </button>
                    </div>

                    {isDropdownOpen && (
                        <div className="absolute right-4 top-56 w-56 bg-white rounded-lg shadow-xl z-20">
                            <ul className="py-4 px-5 justify-center">
                                <li onClick={profile} className="px-4 py-2 hover:bg-gray-200 cursor-pointer">
                                    Profile
                                </li>
                                <li onClick={showFormName} className="px-4 py-2 hover:bg-gray-200 cursor-pointer">
                                    Edit Profile Name
                                </li>
                                <li onClick={showFormAvatar} className="px-4 py-2 hover:bg-gray-200 cursor-pointer">
                                    Edit Profile Avatar
                                </li>
                                <li onClick={showFormEmail} className="px-4 py-2 hover:bg-gray-200 cursor-pointer">
                                    Change Email
                                </li>
                                <li onClick={showFormPassword} className="px-4 py-2 hover:bg-gray-200 cursor-pointer">
                                    Change Password
                                </li>
                            </ul>
                        </div>
                    )}

                    <div className="flex items-center justify-center align-middle text-center" />

                    {/* {formAvatar || formEmail || formName || formPassword || ( */}
                    <div className="mt-5 mx-16">
                        <h2 className="text-2xl font-bold mb-5">Activities</h2>
                        <div className="grid grid-cols-4 gap-6">
                            {fourBoard && fourBoard.length > 0 ? (
                                fourBoard.map((board, index) => (
                                    <div
                                        key={index}
                                        className="border rounded-lg p-4 shadow-lg bg-white"
                                    >
                                       <p className="text-xs font-semibold text-gray-400">{board.status.charAt(0).toUpperCase() + board.status.slice(1)}</p>
                                        <h3 className="text-xl font-bold my-2">{board.name}</h3>
                                        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-3 dark:bg-gray-700">
                                            <div className="bg-green-400 h-2.5 rounded-full dark:bg-blue-500" style={{ width: '75%' }}></div>
                                        </div>
                                        {board.user_id === user?.id ?
                                            (<p className="text-[#15D088] font-semibold">OWNER </p>)
                                            : (<p className="text-[#15D088] font-semibold">COLLABORATOR</p>)}

                                        <hr className="mt-5 mb-4" />
                                        <p className="text-xs font-bold text-gray-500">
                                            Created : <span className='font-semibold text-gray-400'>{board.created_at.substring(0, 10)}</span>
                                        </p>
                                    </div>
                                ))) : (
                                <div className="pb-52">
                                    TIdak Ada ActiVItes
                                </div>
                            )}
                        </div>
                    </div>
                    {/* )} */}


                </div>
            </div >
        </div >

    );
}
