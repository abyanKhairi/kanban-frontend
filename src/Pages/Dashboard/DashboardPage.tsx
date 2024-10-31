import { Label, Modal, Select, TextInput } from "flowbite-react";
import { useState } from "react";
import { useBoardContext } from "../../Context/useBoard";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from "../../Context/useAuth";
import Dashboard from "../../assets/VELO/Dashboard.png"
import line from "../../assets/VELO/line.png"

type Props = {};

type BoardFormsInput = {
    name: string;
    status: string;
};

const validation = Yup.object().shape({
    name: Yup.string().required("Name Is Required"),
    status: Yup.string().required("Status Is Required"),
});

export default function BoardPage({ }: Props) {
    const [openModal, setOpenModal] = useState(false);
    const { boardCreate, boards } = useBoardContext(); // Use board context
    const { register, handleSubmit, reset, formState: { errors } } = useForm<BoardFormsInput>({ resolver: yupResolver(validation) });
    const navigate = useNavigate(); // Initialize useNavigate
    const { user } = useAuth();

    function onCloseModal() {
        setOpenModal(false);
    }

    const handleCreate = (form: BoardFormsInput) => {
        boardCreate(form.name, form.status);
        reset();
        onCloseModal();
    };

    const handleNavigateToBoard = (boardId: number) => {
        navigate(`/board/${boardId}`);
    };

    return (
        <>
            <div>
                <div className="flex mb-24 gap-10 justify-between">
                    <div className="relative w-full h-64 rounded-xl bg-[#0095FF] overflow-hidden">
                        <div className="absolute inset-0 bg-cover bg-center opacity-10 z-0" style={{ backgroundImage: `url(${line})` }} />
                        <div className="relative z-10 p-9">
                            <p className="text-left text-xl opacity-90 text-white">Welcome To</p>
                            <p className="text-left text-2xl font-bold text-white my-2">DASHBOARD</p>
                            <p className="text-left  opacity-90 text-white">
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Beatae, possimus tempore sit assumenda.
                            </p>
                            <div className="pt-7">
                                <button onClick={() => setOpenModal(true)} className="bg-[#126FB2] text-white hover:bg-blue-900 rounded-md px-4 py-2 text-center"><i className="fa-solid fa-plus"></i> New Board</button>
                            </div>
                        </div>
                    </div>

                    <div className="w-1/2 h-64 content-center">
                        <img src={Dashboard} alt="Logo" className="w-full h-fit" />
                    </div>
                </div>


                <div className="flex gap-7 -mt-10">
                    <h3 className="text-3xl  text-gray-900 font-bold dark:text-white">Your Boards</h3>
                </div>

                <div className="mt-10 grid grid-cols-3 gap-7">
                    {boards ? boards.map((board, index) => (
                        <div
                            onClick={() => handleNavigateToBoard(board.id)}
                            key={index}
                            className="border border-slate-300 rounded-[20px] p-4 cursor-pointer shadow-lg bg-white w-full h-full  relative"
                        >
                            <p className="text-xs font-semibold text-gray-400">{board.status.charAt(0).toUpperCase() + board.status.slice(1)}</p>
                            <h3 className="text-xl font-bold my-2">{board.name}</h3>
                            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-3 dark:bg-gray-700">
                                <div className="bg-green-400 h-2.5 rounded-full dark:bg-blue-500" style={{ width: '75%' }}></div>
                            </div>
                            {board.user_id === user?.id ?
                                (<p className="text-green-500 font-semibold">OWNER </p>)
                                : (<p className="text-green-500 font-semibold">COLLABORATOR</p>)}

                            <hr className="mt-5 mb-4" />
                            <p className="text-xs font-bold text-gray-500">
                                Created : <span className='font-semibold text-gray-400'>{board.created_at.substring(0, 10)}</span>
                            </p>
                        </div>
                    )) : ''}
                </div>
            </div >

            <Modal show={openModal} size="md" popup onClose={onCloseModal}>
                <Modal.Header />
                <Modal.Body>
                    <form onSubmit={handleSubmit(handleCreate)}>
                        <div className="space-y-6">
                            <h3 className="text-xl font-medium text-gray-900 dark:text-white">Add Board</h3>

                            <div>
                                <div className="mb-2 block">
                                    <Label htmlFor="board-title" value="Board Title" />
                                </div>
                                <TextInput
                                    id="name"
                                    placeholder="Enter board name"
                                    required
                                    {...register("name")}
                                />
                            </div>

                            <div>
                                <div className="mb-2 block">
                                    <Label htmlFor="board-status" value="Status" />
                                </div>
                                <Select
                                    id="status"
                                    {...register("status")}
                                    required
                                >
                                    <option value="Private">Private</option>
                                    <option value="Public">Public</option>
                                </Select>
                            </div>

                            <div className="w-full">
                                <button
                                    className="border border-green-500 py-2 px-4 rounded-lg text-green-500 font-semibold hover:bg-green-500 hover:text-white transition duration-150 ease-in-out"
                                    type="submit">Add Board</button>
                            </div>
                        </div>
                    </form>
                </Modal.Body>
            </Modal>
        </>
    );
}
