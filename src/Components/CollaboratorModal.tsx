import { Label, Modal, TextInput } from 'flowbite-react'

import { useBoardContext } from '../Context/useBoard';
import * as Yup from "yup";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';


type Props = {
    boardId: number;
    isOpen: boolean;
    onClose: () => void;
}

type CollabInput = {
    email: string
}
const validation = Yup.object().shape({
    email: Yup.string().required("Email Is Required").email('Invalid email format'),
});

export default function CollaboratorModal({ isOpen, boardId, onClose }: Props) {

    const { CollaboratorInvite } = useBoardContext()

    const { register, handleSubmit, reset, formState: { errors } } = useForm<CollabInput>({ resolver: yupResolver(validation) });

    const handleInvite = (from: CollabInput) => {
        try {
            CollaboratorInvite(boardId, from.email);
            reset();
            onClose()
        } catch (error) {
            throw (error)
        }

    }

    return (
        <>
            <Modal show={isOpen} onClose={onClose}>
                <Modal.Header>Invite Collaborator</Modal.Header>
                <Modal.Body>
                    <div className="space-y-6">
                        <form >
                            <div>
                                <div className="mb-2 block">
                                    <Label htmlFor="board-title" value="Collaborator Email" />
                                </div>
                                <TextInput
                                    id="email"
                                    placeholder="Collaborator Email"
                                    required
                                    {...register("email")}
                                />
                                {errors.email && <p className="text-red-500">{errors.email.message}</p>}

                            </div>

                        </form>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <div className="w-full justify-between flex">

                        <button
                            onClick={handleSubmit(handleInvite)}
                            className="border  border-green-500 py-2 px-4 rounded-lg text-green-500 font-semibold hover:bg-green-500 hover:text-white transition duration-150 ease-in-out"
                            type='submit'>
                            Invite
                        </button>                    <button
                            className="border border-red-500 py-2 px-4 rounded-lg text-red-500 font-semibold hover:bg-red-500 hover:text-white transition duration-150 ease-in-out"
                            color="gray" onClick={onClose}>
                            Decline
                        </button>
                    </div>
                </Modal.Footer>
            </Modal>

        </>
    )
}