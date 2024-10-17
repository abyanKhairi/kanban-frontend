import { Button, Label, Modal, Select, TextInput, Card } from "flowbite-react";
import { useState } from "react";
import { useBoardContext } from "../../Context/useBoard";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
// import { Card } from "react-ionicons";
type Props = {}

type BoardFormsInput = {
    name: string,
    status: string
}

const validation = Yup.object().shape({
    name: Yup.string().required("Name Is Required"),
    status: Yup.string().required("Status Is Required"),
})

export default function BoardPage({ }: Props) {
    const [openModal, setOpenModal] = useState(false);// Default status
    const { boardCreate, boards } = useBoardContext(); // Use board context
    const { register, handleSubmit, reset, formState: { errors }, } = useForm<BoardFormsInput>({ resolver: yupResolver(validation) });
    function onCloseModal() {
        setOpenModal(false);
    }

    const handleCreate = (form: BoardFormsInput) => {
        boardCreate(form.name, form.status);
        reset();
        onCloseModal()
    }

    return (
        <>
            <Button onClick={() => setOpenModal(true)} className="float-right bg-orange-300 hover:bg-orange-500">Add Board</Button>

            {/* Modal Section */}
            <Modal show={openModal} size="md" popup onClose={onCloseModal}>
                <Modal.Header />
                <Modal.Body>
                    <form onSubmit={handleSubmit(handleCreate)}>
                        <div className="space-y-6">
                            <h3 className="text-xl font-medium text-gray-900 dark:text-white">Add Board</h3>

                            {/* Board Title */}
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

                            {/* Status */}
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

                            {/* Submit Button */}
                            <div className="w-full">
                                <Button type="submit" >
                                    Add Board
                                </Button>
                            </div>
                        </div>
                    </form>
                </Modal.Body>
            </Modal>

            <h3 className="text-xl font-medium text-gray-900 dark:text-white">Boards List</h3>
            <div className="mt-6 flex  gap-4">
                {boards ? boards.map((board, index) => (
                    <Card key={index} className="max-w-sm">
                        <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                            {board.name}                        </h5>
                        <p className="font-normal text-gray-700 dark:text-gray-400">
                            Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse chronological order.
                        </p>
                        <Button>
                            Read more
                            <svg className="-mr-1 ml-2 h-4 w-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    fillRule="evenodd"
                                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </Button>
                    </Card>
                )) : ''}
            </div>
        </>
    );
}
