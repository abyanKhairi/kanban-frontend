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
                <div className="flex mb-24 gap-6 justify-between">
                    <div className="relative w-full h-64 rounded-xl pt-4 gap-4 bg-blue-500 overflow-hidden">
                        <div className="absolute inset-0 bg-cover bg-center opacity-10" style={{ backgroundImage: `url(${line})` }} />
                        <div className="relative z-10 p-10">
                            <p className="text-left text-xl opacity-50 text-white">Welcome To</p>
                            <p className="text-left text-2xl font-bold text-white">DASHBOARD</p>
                            <p className="text-left text-md opacity-50 text-white">
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Beatae, possimus tempore sit assumenda suscipit omnis culpa optio deleniti voluptatum in.
                            </p>
                            <div className="pt-7">
                                <button onClick={() => setOpenModal(true)} className="bg-blue-700 text-white hover:bg-blue-900 rounded-full px-4 py-2 text-center"><i className="fa-solid fa-plus"></i> New Board</button>
                            </div>
                        </div>
                    </div>

                    <div className="w-1/2 h-64 ">
                        <img src={Dashboard} alt="Logo" className="w-full h-64 " />
                    </div>
                </div>


                <div className="flex gap-7 ">
                    <h3 className="text-3xl  text-gray-900 font-bold dark:text-white">Your Boards</h3>
                </div>

                <div className="mt-8 gap-4 grid grid-cols-3">
                    {boards ? boards.map((board, index) => (
                        <div
                            onClick={() => handleNavigateToBoard(board.id)}
                            key={index}
                            className="border rounded-lg p-4 cursor-pointer shadow-lg bg-white w-80 h-48"
                        >
                            <p className="text-gray-500">{board.status}</p>
                            <h3 className="text-lg font-bold mb-2 truncate">{board.name}</h3>
                            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4 dark:bg-gray-700">
                                <div className="bg-green-400 h-2.5 rounded-full dark:bg-blue-500" style={{ width: '75%' }}></div>
                            </div>
                            {board.user_id === user?.id ?
                                (<p className="text-green-500 font-semibold">Owner </p>)
                                : (<p className="text-green-500 font-semibold">Collaborator</p>)}



                            <hr className="mt-5 mb-4" />
                            <p className="text-gray-500 text-sm mb-2">Created: {new Date(board.created_at).toLocaleDateString()}</p>
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
