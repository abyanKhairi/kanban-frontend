import { useState } from "react";
import { Modal, Button, Label, TextInput, Select } from "flowbite-react";
import { useBoardContext } from "../Context/useBoard";

type EditBoardModalProps = {
    boardId: number;
    currentName: string;
    currentStatus: string;
    isOpen: boolean;
    onClose: () => void;
};

const EditBoardModal = ({ boardId, currentName, currentStatus, isOpen, onClose }: EditBoardModalProps) => {
    const { updateBoard } = useBoardContext();
    const [name, setName] = useState(currentName);
    const [status, setStatus] = useState(currentStatus);

    const handleUpdate = async () => {
        try {
            await updateBoard(boardId, name, status);
            onClose();
        } catch (error) {
            console.error("Error updating board", error);
        }
    };

    return (
        <Modal show={isOpen} size="md" popup onClose={onClose}>
            <Modal.Header />
            <Modal.Body>
                <form >
                    <div className="space-y-6">
                        <h3 className="text-xl font-medium text-gray-900 dark:text-white">Edit Board</h3>
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="boardName" value="Board Title" />
                            </div>
                            <TextInput
                                id="boardName"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>

                        <div >
                            <div className="mb-2 block">
                                <Label htmlFor="boardStatus" value="Status" />
                                <Select
                                    id="boardStatus"
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                >
                                    <option value="public">Public</option>
                                    <option value="private">Private</option>
                                </Select>
                            </div>
                        </div>
                    </div>
                </form>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={handleUpdate}>Save</Button>
                <Button onClick={onClose} color="gray">Cancel</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default EditBoardModal;
