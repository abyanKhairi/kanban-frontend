import { Modal, ToggleSwitch } from 'flowbite-react';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useBoardContext } from '../Context/useBoard';

type Props = {
    isOpen: boolean,
    onClose: () => void,
    permission: {
        id: number,
        user: { avatar: string, name: string, email: string },
        edit_cards: boolean,
        delete_cards: boolean,
        add_cards: boolean,
        add_members: boolean,
        manage_board: boolean,
    } | null,
};

export default function CollaboratorPermissions({ isOpen, onClose, permission }: Props) {
    const { CollaboratorPermissionUpdate } = useBoardContext()
    const [editCards, setEditCards] = useState(permission?.edit_cards || false);
    const [deleteCards, setDeleteCards] = useState(permission?.delete_cards || false);
    const [addCards, setAddCards] = useState(permission?.add_cards || false);
    const [addMembers, setAddMembers] = useState(permission?.add_members || false);
    const [manageBoard, setManageBoard] = useState(permission?.manage_board || false);

    // Update state when permission prop changes
    useEffect(() => {
        if (permission) {
            setEditCards(permission.edit_cards);
            setDeleteCards(permission.delete_cards);
            setAddCards(permission.add_cards);
            setAddMembers(permission.add_members);
            setManageBoard(permission.manage_board);
        }
    }, [permission]);

    // Function to handle saving changes
    const handleSave = async () => {
        if (!permission) return;

        try {
            await CollaboratorPermissionUpdate(
                permission.id,
                addCards,
                editCards,
                deleteCards,
                addMembers,
                manageBoard
            );
            toast.success("Permissions updated successfully.");
            onClose();
        } catch (error) {
            toast.error("Failed to update permissions.");
        }
    };

    return (
        <Modal show={isOpen} onClose={onClose}>
            <Modal.Header>Manage Permissions</Modal.Header>
            <Modal.Body>
                {permission ? (
                    <div className="space-y-6">
                        <div className="flex items-center space-x-4">
                            <img
                                src={`/src/assets/avatar/${permission.user.avatar}`}
                                alt="User Avatar"
                                className="w-14 h-14 rounded-full border-2 border-[#54afe5]"
                            />
                            <div>
                                <p className="text-lg font-medium">{permission.user.name}</p>
                                <p className="text-gray-500 text-sm">{permission.user.email}</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <ToggleSwitch
                                color='green'
                                checked={editCards}
                                label="Edit Cards"
                                onChange={(checked) => setEditCards(checked)}
                            />
                            <ToggleSwitch
                                color='green'
                                checked={deleteCards}
                                label="Delete Cards"
                                onChange={(checked) => setDeleteCards(checked)}
                            />
                            <ToggleSwitch
                                color='green'
                                checked={addCards}
                                label="Add Cards"
                                onChange={(checked) => setAddCards(checked)}
                            />
                            <ToggleSwitch
                                color='green'
                                checked={addMembers}
                                label="Add Members"
                                onChange={(checked) => setAddMembers(checked)}
                            />
                            <ToggleSwitch
                                color='green'
                                checked={manageBoard}
                                label="Manage Board"
                                onChange={(checked) => setManageBoard(checked)}
                            />
                        </div>
                    </div>
                ) : (
                    <p className="text-gray-500">No collaborator selected.</p>
                )}
            </Modal.Body>
            <Modal.Footer>
                <div className="flex justify-between w-full">
                    <button
                        className="border border-green-500 py-2 px-4 rounded-lg text-green-500 font-semibold hover:bg-green-500 hover:text-white transition duration-150 ease-in-out"
                        onClick={handleSave}
                    >
                        Save Changes
                    </button>
                    <button
                        className="border border-red-500 py-2 px-4 rounded-lg text-red-500 font-semibold hover:bg-red-500 hover:text-white transition duration-150 ease-in-out"
                        onClick={onClose}
                    >
                        Close
                    </button>
                </div>
            </Modal.Footer>

        </Modal >
    );
}
