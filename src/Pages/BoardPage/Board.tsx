import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useBoardContext } from "../../Context/useBoard";
import { Board } from "../../Models/Board";
import EditBoardModal from "../../Components/BoardEditModal";

export default function BoardDetailPage() {
    const { id } = useParams<{ id: string }>(); // Get the ID from the URL
    const { getBoardById, handleDeleteBoard } = useBoardContext(); // Access context
    const [board, setBoard] = useState<Board | null>(null);
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchBoard = async () => {
            if (id) {
                const boardData = await getBoardById(Number(id)); // Fetch board by ID
                if (boardData) setBoard(boardData);
            }
        };
        fetchBoard();
    }, [id, getBoardById]);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const deleteBoard = async () => {
        if (board && window.confirm("Are you sure you want to delete this board?")) {
            await handleDeleteBoard(board.id);
            navigate("/dashboard");
        }
    };

    return (
        <div>
            {board ? (
                <div>
                    <h2>{board.name}</h2>
                    <p>ID: {board.id}</p>
                    <p>Status: {board.status}</p>

                    {board.columns && board.columns.length > 0 ? (
                        <div>
                            <h3>Columns:</h3>
                            <ul>
                                {board.columns.map((column) => (
                                    <li key={column.id}>{column.name}</li>
                                ))}
                            </ul>
                        </div>
                    ) : (
                        <p>No columns found for this board.</p>
                    )}

                    <button onClick={openModal} className="mt-4 text-blue-500">
                        Edit Board
                    </button>

                    <button onClick={deleteBoard} className="mt-4 text-red-500">
                        Delete Board
                    </button>

                    {/* Edit Modal */}
                    {board && (
                        <EditBoardModal
                            boardId={board.id}
                            currentName={board.name}
                            currentStatus={board.status}
                            isOpen={isModalOpen}
                            onClose={closeModal}
                        />
                    )}
                </div>
            ) : (
                <p>Loading board details...</p>
            )}
        </div>
    );
}
