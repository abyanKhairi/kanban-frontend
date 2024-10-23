import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useBoardContext } from "../../Context/useBoard";
import { Board, Columns, Tasks } from "../../Models/Board";
import { DndContext, DragEndEvent, DragOverEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import ColumnContainer from "../../Components/ColumnsContainer";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import EditBoardModal from "../../Components/BoardEditModal";
import { Spinner } from "flowbite-react";
import axios from "axios";
import { createPortal } from "react-dom";
import TaskContainer from "../../Components/TasksContainer";

export default function BoardDetailPage() {
    const { id } = useParams<{ id: string }>();
    const { getBoardById, handleDeleteBoard, CreateColumn, ColumnGet, DeleteColumn, ColumnUpdate } = useBoardContext();
    const [board, setBoard] = useState<Board | null>(null);
    const [columns, setColumns] = useState<Columns[]>([]);
    const [activeColumn, setActiveColumn] = useState<Columns | null>(null);
    const [activeTask, setActiveTask] = useState<Tasks | null>(null);
    const sensors = useSensors(useSensor(PointerSensor, {
        activationConstraint: { distance: 17 },
    }));
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const columnsId = useMemo(() => columns.map((column) => column.id), [columns]);

    useEffect(() => {
        const fetchBoard = async () => {
            try {
                if (id) {
                    const boardData = await getBoardById(Number(id));
                    if (boardData) {
                        setBoard(boardData);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch board:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBoard();
    }, [id, getBoardById]);

    useEffect(() => {
        const fetchColumns = async () => {
            try {
                if (id) {
                    const columnData = await ColumnGet(Number(id));
                    if (columnData) {
                        const updatedColumns = columnData.map(col => ({
                            ...col,
                            tasks: col.task || []
                        }));
                        setColumns(updatedColumns);
                    }
                } else {
                    setColumns([]);
                }
            } catch (error) {
                console.error("Failed to fetch columns:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchColumns();
    }, [id, ColumnGet]);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const deleteBoard = async () => {
        if (board && window.confirm("Are you sure you want to delete this board?")) {
            await handleDeleteBoard(board.id);
            navigate("/dashboard");
        }
    };

    const HandleCreateColumn = async () => {
        if (board) {
            const newPosition = columns.length + 1;
            try {
                await CreateColumn(board.id, "New Column", newPosition);
            } catch (error) {
                console.error("Failed to create column:", error);
            }
        }
    };


    const createTask = async (column_id: number) => {
        const currentColumn = columns.find(col => col.id === column_id);
        if (!currentColumn) return;

        const currentTasks = currentColumn.tasks || [];
        const newTaskPosition = currentTasks.length + 1;

        const newTask = {
            column_id,
            title: `Task Content ${newTaskPosition}`,
            position: newTaskPosition,
        };

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/kanban/board/column-task/task', newTask);
            const data = response.data;

            if (data.success) {
                const taskToAdd: Tasks = {
                    id: data.data.id,
                    column_id,
                    title: data.data.title,
                    position: newTaskPosition,
                    description: data.data.description,
                    deadline: data.data.deadline,
                    status: data.data.status,
                };

                setColumns(prevColumns => prevColumns.map(col =>
                    col.id === column_id ? { ...col, tasks: [...(col.tasks || []), taskToAdd] } : col
                ));
            } else {
                console.error('Failed to create task:', data.message);
                alert('Failed to create task: ' + data.message);
            }
        } catch (error) {
            console.error('Error creating task:', error);
            alert('Failed to create task.');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Spinner className="w-16 h-16" aria-label="Center-aligned spinner example" />
            </div>
        );
    }

    if (!board) {
        return <p>Error: Board not found.</p>;
    }

    // -------------------------------------DRAG----------------------------------------

    const onDragStart = (event: DragStartEvent) => {
        const { current } = event.active.data;
        if (current?.type === "Column") {
            setActiveColumn(current.column);
        }
        if (current?.type === "Task") {
            setActiveTask(current.tasks);
        }
    };

    const onDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveColumn(null);
        setActiveTask(null);

        if (!over) return; // Jika task tidak dipindahkan ke target apapun

        const activeData = active.data.current;
        const overData = over.data.current;

        // Handle drag-and-drop untuk task
        if (activeData?.type === "Task") {
            // Ambil ID kolom aktif dan kolom tujuan
            const activeColumnId = activeData.tasks.column_id;
            const overColumnId = overData?.tasks?.column_id || activeColumnId;

            // Jika task dipindahkan dalam kolom yang sama (Reordering)
            if (activeColumnId === overColumnId) {
                const activeColumn = columns.find(col => col.id === activeColumnId);
                const activeTaskIndex = activeColumn?.tasks.findIndex(task => `task-${task.id}` === active.id);
                const overTaskIndex = activeColumn?.tasks.findIndex(task => `task-${task.id}` === over.id);

                if (activeTaskIndex !== undefined && overTaskIndex !== undefined) {
                    const newTasks = arrayMove(activeColumn.tasks, activeTaskIndex, overTaskIndex);
                    setColumns(prevColumns => prevColumns.map(col =>
                        col.id === activeColumnId ? { ...col, tasks: newTasks } : col
                    ));

                    // Memperbarui posisi task di backend
                    try {
                        await axios.put(`http://127.0.0.1:8000/api/kanban/board/column-task/task-position/${active.id.replace("task-", "")}`, { position: overTaskIndex });
                    } catch (error) {
                        console.error('Error updating task position:', error);
                    }
                }
            } else {
                // Jika task dipindahkan ke kolom berbeda (Moving task to a different column)
                const activeColumn = columns.find(col => col.id === activeColumnId);
                const overColumn = columns.find(col => col.id === overColumnId);
                const taskToMove = activeColumn.tasks.find(task => `task-${task.id}` === active.id);

                if (taskToMove) {
                    const updatedActiveTasks = activeColumn.tasks.filter(task => `task-${task.id}` !== active.id);
                    const newOverTasks = [...(overColumn.tasks || []), { ...taskToMove, column_id: overColumn.id }];

                    setColumns(prevColumns => prevColumns.map(col => {
                        if (col.id === activeColumnId) {
                            return { ...col, tasks: updatedActiveTasks };
                        }
                        if (col.id === overColumnId) {
                            return { ...col, tasks: newOverTasks };
                        }
                        return col;
                    }));

                    // Update kolom task dan posisinya di backend
                    try {
                        await Promise.all([
                            axios.put(`http://127.0.0.1:8000/api/kanban/board/column-task/task-column/${taskToMove.id}`, { column_id: overColumn.id }),
                            axios.put(`http://127.0.0.1:8000/api/kanban/board/column-task/task-position/${taskToMove.id}`, { position: newOverTasks.length - 1 })
                        ]);
                    } catch (error) {
                        console.error('Error moving task to new column:', error);
                    }
                }
            }
        }
        // Handle drag-and-drop untuk column
        else if (activeData?.type === "Column") {
            const activeIndex = columns.findIndex(col => col.id === active.id);
            const overIndex = columns.findIndex(col => col.id === over.id);

            if (activeIndex !== overIndex) {
                const newColumns = arrayMove(columns, activeIndex, overIndex);
                setColumns(newColumns);

                // Memperbarui posisi kolom di backend
                try {
                    const positionUpdates = newColumns.map((column, index) =>
                        axios.put(`http://127.0.0.1:8000/api/kanban/board/column-position/${column.id}`, { position: index })
                    );
                    await Promise.all(positionUpdates);
                } catch (error) {
                    console.error('Error updating column positions:', error);
                    setColumns(columns); // Kembalikan state jika ada error
                }
            }
        }
    };



    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">{board.name}</h1>
            <div className="mb-4">
                <button onClick={openModal} className="py-2 px-5 rounded bg-orange-300 hover:bg-orange-500 font-semibold mr-2">
                    Edit Board
                </button>
                <button onClick={deleteBoard} className="py-2 px-5 rounded bg-red-300 hover:bg-red-500 font-semibold">
                    Delete Board
                </button>
                <div className="m-auto flex min-h-screen w-full items-center overflow-x-auto overflow-y-hidden px-[40px]">
                    {/* <DndContext onDragStart={onDragStart} onDragEnd={onDragEnd} onDragOver={onDragOver} sensors={sensors}> */}
                    <DndContext onDragStart={onDragStart} onDragEnd={onDragEnd} sensors={sensors}>
                        {/* <DndContext sensors={sensors}> */}
                        {/* <DndContext > */}
                        <div className="m-auto flex gap-4">
                            <SortableContext items={columnsId}>
                                {columns.map(colum => (
                                    <ColumnContainer
                                        key={colum.id}
                                        column={colum}
                                        ColumnUpdate={ColumnUpdate}
                                        deleteColumn={DeleteColumn}
                                        createTask={createTask}
                                        tasks={colum.tasks}
                                    />
                                ))}
                            </SortableContext>
                            <button
                                onClick={HandleCreateColumn}
                                className='h-[60px] w-[350px] min-w-[350px] cursor-pointer rounded-lg bg-mainBackgoundColor border-2 border-columnBackgroundColor p-4 ring-rose-500 hover:ring-2 flex gap-2'
                                disabled={!board}
                            >
                                Add Column
                            </button>
                        </div>
                        {createPortal(
                            <DragOverlay>
                                {activeColumn && (
                                    <ColumnContainer
                                        column={activeColumn}
                                        ColumnUpdate={ColumnUpdate}
                                        deleteColumn={DeleteColumn}
                                        createTask={createTask}
                                        tasks={activeColumn.tasks}
                                    />
                                )}
                                {activeTask && (<TaskContainer tasks={activeTask} />)}
                            </DragOverlay>,
                            document.body
                        )}

                    </DndContext>
                    {isModalOpen && (
                        <EditBoardModal
                            boardId={id}
                            currentName={board.name}
                            currentStatus={board.status}
                            isOpen={isModalOpen}
                            onClose={closeModal}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
