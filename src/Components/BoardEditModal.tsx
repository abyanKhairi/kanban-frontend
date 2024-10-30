import { useState, useEffect } from "react";
import { Modal, Label, TextInput, Select } from "flowbite-react";
import { useBoardContext } from "../Context/useBoard";
import CollaboratorPermissions from "./CollaboratorPermissions";

type EditBoardModalProps = {
    boardId: number;
    currentName: string;
    currentStatus: string;
    isOpen: boolean;
    onClose: () => void;
    BoardMake: number;
    DeleteBoard: () => void;
};

const EditBoardModal = ({ boardId, currentName, currentStatus, isOpen, onClose, BoardMake, DeleteBoard }: EditBoardModalProps) => {
    const { updateBoard, CollaboratorsPermissions, CollaboratorDelete } = useBoardContext();
    const [name, setName] = useState(currentName);
    const [status, setStatus] = useState(currentStatus);
    const [openModalPermission, setOpenModalPermission] = useState(false)
    const [selectedCollaborator, setSelectedCollaborator] = useState(null);
    const onClosePermission = () => setOpenModalPermission(false);

    const [collaborators, setCollaborators] = useState([]);
    useEffect(() => {
        if (isOpen) {
            const loadCollaborators = async () => {
                try {
                    const data = await CollaboratorsPermissions(boardId);

                    const collab = data.data.filter(
                        (collaborator) => collaborator.user.id !== BoardMake
                    );
                    setCollaborators(collab);
                } catch (error) {
                    console.error("Error fetching collaborators", error);
                }
            };

            loadCollaborators();
        }
    }, []);

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await updateBoard(boardId, name, status);
            onClose();
        } catch (error) {
            console.error("Error updating board", error);
        }
    };

    const handleEditCollaborator = (collaborator) => {
        setSelectedCollaborator(collaborator); // Set the selected collaborator
        setOpenModalPermission(true); // Open the permissions modal
    };


    const handleDeleteCollaborator = async (permission_id: number,) => {
        await CollaboratorDelete(boardId, permission_id)
    };

    return (
        <>
            <Modal show={isOpen} size="2xl" popup onClose={onClose}>
                <Modal.Header />
                <Modal.Body>
                    <form >
                        <div className="space-y-6">
                            <div className="flex gap-2">
                                <h3 className="text-xl font-medium text-gray-900 dark:text-white">Edit Board</h3>
                                <button
                                    className="border border-red-500 py-1 px-2 rounded-lg text-red-500 font-semibold hover:bg-red-500 hover:text-white transition duration-150 ease-in-out"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        DeleteBoard();
                                    }}
                                >
                                    Delete Board
                                </button>
                            </div>
                            <div className="flex space-x-4">
                                <div className="flex-1">
                                    <div className="mb-2 block">
                                        <Label htmlFor="boardName" value="Board Title" />
                                    </div>
                                    <TextInput
                                        id="boardName"
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full"
                                    />
                                </div>

                                <div className="flex-1">
                                    <div className="mb-2 block">
                                        <Label htmlFor="boardStatus" value="Status" />
                                    </div>
                                    <Select
                                        id="boardStatus"
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value)}
                                        className="w-full"
                                    >
                                        <option value="public">Public</option>
                                        <option value="private">Private</option>
                                    </Select>
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <button
                                    className="border  border-green-500 py-2 px-4 rounded-lg text-green-500 font-semibold hover:bg-green-500 hover:text-white transition duration-150 ease-in-out"

                                    onClick={handleUpdate} type="submit" >
                                    Save
                                </button>
                            </div>
                        </div>
                    </form>

                    <div className="mt-8 space-y-2">
                        <h4 className="text-lg font-medium text-gray-900 dark:text-white">Collaborators</h4>
                        <div className="bg-gray-100 p-4 rounded space-y-4">
                            {collaborators.length > 0 ? (
                                collaborators.map((collaborator) => (
                                    <div key={collaborator.id} className="flex items-center justify-between border-b border-gray-200 pb-2">
                                        <div className="flex items-center">
                                            <img src={'/src/assets/avatar/' + collaborator.user.avatar} alt={collaborator.user.name} className="w-10 h-10 rounded-full mr-2" />
                                            <div className="flex flex-col">
                                                <p className="font-semibold text-gray-800">{collaborator.user.name}</p>
                                                <p className="text-sm text-gray-600">{collaborator.user.email}</p>
                                            </div>
                                        </div>

                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleEditCollaborator(collaborator)}
                                                className="border  border-blue-500 py-1 px-2 rounded-lg text-blue-500 font-semibold hover:bg-blue-500 hover:text-white transition duration-150 ease-in-out"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDeleteCollaborator(collaborator.id)}
                                                className="border  border-red-500 py-1 px-2 rounded-lg text-red-500 font-semibold hover:bg-red-500 hover:text-white transition duration-150 ease-in-out"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-600">No collaborators added yet.</p>
                            )}
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <button
                        className="border border-red-500 py-2 px-4 rounded-lg text-red-500 font-semibold hover:bg-red-500 hover:text-white transition duration-150 ease-in-out"
                        onClick={onClose}
                    >
                        Close
                    </button>
                </Modal.Footer>
            </Modal>
            <CollaboratorPermissions
                isOpen={openModalPermission}
                onClose={onClosePermission}
                permission={selectedCollaborator}
            />
        </>
    );
};

export default EditBoardModal;
