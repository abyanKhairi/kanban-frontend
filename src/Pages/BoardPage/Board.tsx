import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useBoardContext } from "../../Context/useBoard";
import { Board, Columns, Tasks } from "../../Models/Board";
import { DndContext, DragEndEvent, DragOverEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import ColumnContainer from "../../Components/ColumnsContainer";
import { SortableContext } from "@dnd-kit/sortable";
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
        activationConstraint: { distance: 65 },
    }));
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const columnsId = useMemo(() => columns.map((column) => column.id), [columns]);


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




    // -------------------------------------DRAG----------------------------------------



    const arrayMove = (array: any[], fromIndex: number, toIndex: number) => {
        const newArray = Array.from(array);
        const [movedItem] = newArray.splice(fromIndex, 1);
        newArray.splice(toIndex, 0, movedItem);
        return newArray;
    };
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
        setActiveColumn(null)
        setActiveTask(null)
        const { active, over } = event;
        if (!over) return;

        const activeData = active.data.current;
        const overData = over.data.current;

        if (activeData?.type === "Task") {
            const activeColumnId = activeData.tasks.column_id;
            const overColumnId = overData?.tasks?.column_id || activeColumnId; // Kolom tujuan

            if (activeColumnId === overColumnId) {
                // Memindahkan tugas dalam kolom yang sama
                const activeColumn = columns.find(col => col.id === activeColumnId);
                const overTaskIndex = activeColumn?.tasks.findIndex(task => task.id === over.id);
                const activeTaskIndex = activeColumn?.tasks.findIndex(task => task.id === active.id);

                if (overTaskIndex !== undefined && activeTaskIndex !== undefined) {
                    const newTasks = [...activeColumn.tasks];
                    const [movedTask] = newTasks.splice(activeTaskIndex, 1);
                    newTasks.splice(overTaskIndex, 0, movedTask);

                    setColumns(prevColumns => prevColumns.map(col =>
                        col.id === activeColumnId ? { ...col, tasks: newTasks } : col
                    ));

                    // Update posisi tugas di backend
                    try {
                        await axios.put(`http://127.0.0.1:8000/api/kanban/board/column-task/task-position/${movedTask.id}`, { position: overTaskIndex });
                        console.log('Task position updated successfully.');
                    } catch (error) {
                        console.error('Error updating task position:', error);
                    }
                }
            } else {
                // Memindahkan tugas antar kolom
                const activeColumn = columns.find(col => col.id === activeColumnId);
                const overColumn = columns.find(col => col.id === overColumnId);

                if (activeColumn && overColumn) {
                    const activeTaskIndex = activeColumn.tasks.findIndex(task => task.id === active.id);
                    const taskToMove = activeColumn.tasks[activeTaskIndex];

                    const updatedActiveTasks = activeColumn.tasks.filter(task => task.id !== active.id);

                    // Menentukan posisi untuk task yang akan dipindahkan
                    let newOverTasks = [...overColumn.tasks];
                    let newTaskPosition;

                    if (newOverTasks.length > 0) {
                        // Jika kolom tujuan memiliki task, gunakan posisi terakhir
                        newTaskPosition = newOverTasks.length; // menempatkan di akhir
                        newOverTasks.push({ ...taskToMove, column_id: overColumn.id });
                    } else {
                        // Jika kolom tujuan kosong, berikan posisi 1
                        newTaskPosition = 0; // Posisi 1 untuk kolom kosong
                        newOverTasks = [{ ...taskToMove, column_id: overColumn.id }];
                    }

                    setColumns(prevColumns => prevColumns.map(col => {
                        if (col.id === activeColumn.id) {
                            return { ...col, tasks: updatedActiveTasks };
                        }
                        if (col.id === overColumn.id) {
                            return { ...col, tasks: newOverTasks };
                        }
                        return col;
                    }));

                    // Update column_id dan posisi tugas di backend setelah ditambahkan ke kolom baru
                    try {
                        // Update column_id
                        await axios.put(`http://127.0.0.1:8000/api/kanban/board/column-task/task-column/${taskToMove.id}`, { column_id: overColumn.id });
                        // Update posisi
                        await axios.put(`http://127.0.0.1:8000/api/kanban/board/column-task/task-position/${taskToMove.id}`, { position: newTaskPosition });
                        console.log('Task moved to new column and position updated successfully.');
                    } catch (error) {
                        console.error('Error moving task to new column:', error);
                    }
                }
            }
        } else if (activeData?.type === "Column") {
            // Logika pemindahan kolom (sama seperti sebelumnya)
            const activeIndex = columns.findIndex(col => col.id === active.id);
            const overIndex = columns.findIndex(col => col.id === over.id);

            if (activeIndex !== overIndex) {
                const newColumns = arrayMove(columns, activeIndex, overIndex);
                setColumns(newColumns);

                const positionUpdates = newColumns.map((column, index) =>
                    axios.put(`http://127.0.0.1:8000/api/kanban/board/column-position/${column.id}`, { position: index })
                );

                try {
                    await Promise.all(positionUpdates);
                    console.log('Column positions updated successfully.');
                } catch (error) {
                    console.error('Error updating column positions:', error);
                    setColumns(columns);
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
                        <div className="m-auto flex gap-4">
                            <SortableContext items={columnsId}>
                                {columns.map(colum => (
                                    <ColumnContainer
                                        key={`${colum.id}-${colum.name}`}
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

