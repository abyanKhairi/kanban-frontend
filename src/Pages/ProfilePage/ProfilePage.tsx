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


    return (


        <div className="container px-6 pt-9 relative">
            <div className="relative w-full h-28 rounded-t-lg">
                <div
                    className="absolute z-10 top-0 left-0 w-full h-full rounded-t-lg bg-cover bg-center"
                    style={{
                        backgroundImage: `url(${line})`,
                        opacity: 0.2,
                    }}
                />
                <div className="absolute top-0 left-0 w-full h-full rounded-t-lg bg-[#54afe5] " />
                <div className="bg-[#FBF8F8] rounded-lg gap-8 pb-54 shadow-lg p-6">
                    <div className="flex ml-12 items-center mb-14 ">
                        <div className=" flex z-10">

                            <img

                                src={`/src/assets/avatar/` + avatar}
                                alt="User"
                                className="w-56 h-56 rounded-full bg-white border-[#54afe5] border-1  mr-6 z-10 "
                            />

                            <form
                                className={`${formAvatar ? 'block' : 'hidden'}`}
                                onSubmit={handleUpdateAvatar}
                            >
                                <div className="space-y-6 text-center items-center justify-center">
                                    <h3 className="text-xl font-medium text-gray-900 dark:text-white">Element Bender</h3>
                                    <div className="flex flex-wrap space-x-4 justify-center">
                                        {avatars.map((avatarImage, index) => (
                                            <div key={index} className="flex flex-col items-center">
                                                <img
                                                    src={avatarImage.src}
                                                    alt={avatarImage.name}
                                                    className={`w-20 h-20 rounded-full cursor-pointer ${avatar === avatarImage.name ? 'border-2 border-blue-500' : ''}`}
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

                        <form
                            className={`${formPassword ? 'block' : 'hidden'} z-10 `}
                            onSubmit={handleUpdatePassword}>
                            <div className="space-y-2">
                                <h3 className="text-xl  font-semibold text-gray-900 dark:text-white">Change Password</h3>

                                <div className="flex gap-3">
                                    <div className="">

                                        <div>
                                            <input
                                                className="text-lg font-semibold py-1 px-2 border border-gray-300 rounded"
                                                id="currentPassword" type="password" placeholder="Current Password" value={current_password} onChange={(e) =>
                                                    setCurrent_Password(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className="gap-2">
                                        <div className="mb-2">

                                            <input
                                                className="text-lg font-semibold py-1 px-2 border border-gray-300 rounded"
                                                id="newPassword" type="password" placeholder="New Password" value={new_password} onChange={(e) =>
                                                    setNew_Password(e.target.value)}
                                            />
                                        </div>
                                        <div>

                                            <input
                                                className="text-lg font-semibold py-1 px-2 border border-gray-300 rounded"
                                                id="passwordConfirmation" placeholder="Confirm New Password" type="password" value={new_password_confirmation}
                                                onChange={(e) => setNew_Password_confirmation(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <button type="submit" className="py-1 px-4 mx-auto flex bg-blue-500 text-white rounded hover:bg-blue-600">Change Password</button>
                            </div>
                        </form>


                        <div className={`z-10 mt-14 ${formAvatar ? 'hidden' : 'block'} ${formPassword ? 'hidden' : 'block'} `} >
                            <h2
                                className={`${formName ? 'hidden' : 'block'} text-2xl font-bold`}
                                style={{ minHeight: '40px' }}
                            >
                                {user.name}
                            </h2>
                            <form
                                className={`${formName ? 'block' : 'hidden'}`}
                                onSubmit={handleUpdateName}
                            >
                                {/* <h3 className="text-xl font-medium text-gray-900 dark:text-white">Change Your Name</h3> */}
                                <div className="flex gap-4 items-center">
                                    <input
                                        id="boardName"
                                        className="text-2xl font-bold py-1 px-2 border border-gray-300 rounded"
                                        type="text"
                                        value={name}
                                        autoFocus
                                        autoComplete="off"
                                        onChange={(e) => setName(e.target.value)}
                                        style={{ minHeight: '40px' }}
                                    />
                                    <button
                                        type="submit"
                                        className="py-1 px-4 bg-blue-500 text-white rounded hover:bg-blue-600"
                                    >
                                        Update Name
                                    </button>
                                </div>
                            </form>




                            <p
                                className={`${formEmail ? 'hidden' : 'block'} text-gray-600 text-xl `}>{user.email}</p>
                            <form
                                className={`${formEmail ? 'block' : 'hidden'}`}
                                onSubmit={handleUpdateEmail}
                            >
                                <div className="flex gap-2">
                                    {/* <h3 className="text-xl font-medium text-gray-900 dark:text-white">Edit Email</h3> */}
                                    <div>
                                        <input
                                            id="email"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="text-xl py-2 px-4 border border-gray-300 rounded w-full"
                                            autoFocus
                                            autoComplete="off"
                                            placeholder="Enter new email"
                                        />
                                    </div>
                                    <div>
                                        <input
                                            id="password"
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="text-xl py-2 px-4 border border-gray-300 rounded w-full"
                                            autoComplete="off"
                                            placeholder="Enter password"
                                        />
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
                        <div className="absolute right-36 top-36 w-48 bg-white rounded-lg shadow-lg z-20">
                            <ul className="py-2">
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

                    <div className="flex items-center justify-center align-middle text-center">
                        {/* <form
                            className={`${formPassword ? 'block' : 'hidden'}  `}
                            onSubmit={handleUpdatePassword}>
                            <div className="space-y-6">
                                <h3 className="text-xl font-medium text-gray-900 dark:text-white">Change Password</h3>

                                <div className="flex">
                                    <div className="">

                                        <div>
                                            <div className="mb-2 block">
                                                <Label htmlFor="currentPassword" value="Current Password" />
                                            </div>
                                            <TextInput id="currentPassword" type="password" value={current_password} onChange={(e) =>
                                                setCurrent_Password(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className="">
                                        <div>
                                            <div className="mb-2 block">
                                                <Label htmlFor="newPassword" value="New Password" />
                                            </div>
                                            <TextInput id="newPassword" type="password" value={new_password} onChange={(e) =>
                                                setNew_Password(e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <div className="mb-2 block">
                                                <Label htmlFor="passwordConfirmation" value="Confirm New Password" />
                                            </div>
                                            <TextInput id="passwordConfirmation" type="password" value={new_password_confirmation}
                                                onChange={(e) => setNew_Password_confirmation(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <button type="submit">Change Password</button>
                            </div>
                        </form> */}

                        {/* <form
                            className={`${formEmail ? 'block' : 'hidden'}  `}
                            onSubmit={handleUpdateEmail}>
                            <div className="space-y-6">
                                <h3 className="text-xl font-medium text-gray-900 dark:text-white">Edit Email</h3>
                                <div className="flex">
                                    <div >
                                        <div className="mb-2 block">
                                            <Label htmlFor="email" value="Your Email" />
                                        </div>
                                        <TextInput id="email" type="email" value={email} onChange={(e) =>
                                            setEmail(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <div className="mb-2 block">
                                            <Label htmlFor="password" value="Current Password" />
                                        </div>
                                        <TextInput id="password" type="password" value={password} onChange={(e) =>
                                            setPassword(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                            <button type="submit">Update Email</button>
                        </form> */}


                        {/* <form
                            className={`${formName ? 'block' : 'hidden'}  `}
                            onSubmit={handleUpdateName}>
                            <div className="space-y-6">
                                <h3 className="text-xl font-medium text-gray-900 dark:text-white">Edit Name</h3>
                                <div>
                                    <div className="mb-2 block">
                                        <Label htmlFor="boardName" value="Your Name" />
                                    </div>
                                    <TextInput id="boardName" type="text" value={name} onChange={(e) =>
                                        setName(e.target.value)}
                                    />
                                </div>
                            </div>
                            <button type="submit">Update Name</button>
                        </form> */}


                        {/* <form
                            className={`${formAvatar ? 'block' : 'hidden'}  `}
                            onSubmit={handleUpdateAvatar}>
                            <div className="space-y-6">
                                <h3 className="text-xl font-medium text-gray-900 dark:text-white">Element Bender</h3>
                                <div className="flex flex-wrap space-x-4">
                                    {avatars.map((avatarImage, index) => (
                                        <div key={index} className="flex flex-col items-center">
                                            <img src={avatarImage.src} alt={avatarImage.name} className={`w-20 h-20 rounded-full cursor-pointer ${avatar === avatarImage.name ? 'border-2 border-blue-500' : ''}`}
                                                onClick={() => setAvatar(avatarImage.name)}
                                            />
                                            <Label htmlFor={`avatar${index + 1}`}>{avatarImage.title}</Label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <button type="submit">Update Avatar</button>
                        </form> */}



                    </div>

                    {/* {formAvatar || formEmail || formName || formPassword || ( */}
                    <div className="mt-20 mx-16">
                        <h2 className="text-2xl font-bold mb-4">Activities</h2>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            {fourBoard && fourBoard.length > 0 ? (

                                fourBoard.map((board, index) => (
                                    <div
                                        key={index}
                                        className="border rounded-lg p-4 shadow-lg bg-white"
                                    >
                                        <p className="text-gray-500">Public & Private</p>
                                        <h3 className="text-lg font-bold mb-2">{board.name}</h3>
                                        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4 dark:bg-gray-700">
                                            <div className="bg-blue-600 h-2.5 rounded-full dark:bg-blue-500" style={{ width: '75%' }}></div>
                                        </div>
                                        <p className="text-green-500">{board.status}</p>
                                        <hr className="mt-5 mb-4" />
                                        <p className="text-gray-500">Created: {new Date(board.created_at).toLocaleDateString()}</p>
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
