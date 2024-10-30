import { useNavigate, useParams } from "react-router-dom";
import { useCallback, useEffect, useMemo, useState } from "react";
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
import debounce from "lodash.debounce"; // Import debounce dari lodash
import { useAuth } from "../../Context/useAuth";
import { toast } from "react-toastify";
import CollaboratorModal from "../../Components/CollaboratorModal";
import { handleError } from "../../Helpers/HandleError";
import Swal from "sweetalert2";
// import { CollaboratorModal } from "../../Components/CollaboratorModal";



export default function BoardDetailPage() {
    const { id } = useParams<{ id: string }>();
    const { getBoardById, handleDeleteBoard, CreateColumn, ColumnGet, DeleteColumn, ColumnUpdate, EditTask, fetchPermissions, permissions, ShowCollaboratorBoard } = useBoardContext();
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
    const [collaborator, setCollaborator] = useState(false)
    // const [permissions, set] = useState<UserPermissions | null>(null)
    // useEffect(() => {
    //     const fetchBoard = async () => {
    //         try {
    //             if (id) {
    //                 const boardData = await getBoardById(Number(id));
    //                 if (boardData) {
    //                     setBoard(boardData);
    //                 }
    //             }
    //         } catch (error) {
    //             console.error("Failed to fetch board:", error);
    //         } finally {
    //             setLoading(false);
    //         }
    //     };
    //     fetchBoard();
    // }, [id, getBoardById]);

    // useEffect(() => {
    //     const fetchColumns = async () => {
    //         try {
    //             if (id) {
    //                 const columnData = await ColumnGet(Number(id));
    //                 if (columnData) {
    //                     const updatedColumns = columnData.map(col => ({
    //                         ...col,
    //                         tasks: col.task || []
    //                     }));
    //                     setColumns(updatedColumns);
    //                 }
    //             } else {
    //                 setColumns([]);
    //             }
    //         } catch (error) {
    //             console.error("Failed to fetch columns:", error);
    //         } finally {
    //             setLoading(false);
    //         }
    //     };
    //     fetchColumns();
    // }, [id, ColumnGet]);

    // console.log(permissions?.user_id)

    const [collaborators, setCollaborators] = useState([]);
    useEffect(() => {

        const loadCollaborators = async () => {
            try {
                const data = await ShowCollaboratorBoard(Number(id));

                if (data) {

                    const collab = data.data

                    setCollaborators(collab);
                }

            } catch (error) {
                console.error("Error fetching collaborators", error);
            }
        };

        loadCollaborators();

    }, []);


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
    }, [id]);

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


    // const debouncedFetchBoard = useCallback(
    //     debounce(async (boardId: number) => {
    //         try {
    //             // if (!isLoggedIn) return;
    //             const boardData = await getBoardById(boardId);
    //             if (boardData) {
    //                 setBoard(boardData);
    //             }
    //         } catch (error) {
    //             console.error("Failed to fetch board:", error);
    //         } finally {
    //             setLoading(false);
    //         }
    //     }, 300), [getBoardById, isLoggedIn] // 300ms debounce
    // );

    // const debouncedFetchColumns = useCallback(
    //     debounce(async (boardId: number) => {
    //         try {
    //             const columnData = await ColumnGet(boardId);
    //             if (columnData) {
    //                 const updatedColumns = columnData.map(col => ({
    //                     ...col,
    //                     tasks: col.task || []
    //                 }));
    //                 setColumns(updatedColumns);
    //             }
    //         } catch (error) {
    //             console.error("Failed to fetch columns:", error);
    //         } finally {
    //             setLoading(false);
    //         }
    //     }, 300), [ColumnGet]
    // );

    // useEffect(() => {
    //     if (id) {
    //         setLoading(true);
    //         debouncedFetchBoard(Number(id));
    //     }
    // }, [id, debouncedFetchBoard]);

    // useEffect(() => {
    //     if (id) {
    //         setLoading(true);
    //         debouncedFetchColumns(Number(id));
    //     }
    // }, [id, debouncedFetchColumns]);


    useEffect(() => {
        const perm = async () => {
            try {
                if (id) {
                    fetchPermissions(Number(id))
                }
                return
            } catch (error) {

            }
        }
        perm()
    }, [id])

    // const tes = () => {
    //     const coba = fetchPermissions(Number(id))
    //     console.log(coba)
    // }


    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
    const closeCollaborator = () => setCollaborator(false);

    const deleteBoard = async () => {
        if (board) {
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
            const response = await axios.post(`http://127.0.0.1:8000/api/kanban/board/${id}/column-task/task`, newTask);
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
                toast.success("Task Added")
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

    const deleteTask = async (column_id: number, task_id: number) => {
        // Show a confirmation alert
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            try {
                const response = await axios.delete(`http://127.0.0.1:8000/api/kanban/board/${id}/column-task/task-delete/${task_id}`);
                const data = response.data;

                if (data.success) {
                    setColumns(prevColumns => prevColumns.map(col =>
                        col.id === column_id
                            ? { ...col, tasks: col.tasks.filter(task => task.id !== task_id) }
                            : col
                    ));
                    toast.success("Task Deleted");
                } else {
                    console.error("Failed to delete task:", data.message);
                    toast.error("Error Delete Task");
                }
            } catch (error) {
                toast.error("Failed To Delete Task");
            }
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

        if (!over) return;
        const activeData = active.data.current;
        const overData = over.data.current;

        if (activeData?.type === "Task") {
            // const activeColumnId = activeData.tasks.column_id;
            // const overColumnId = overData?.tasks?.column_id || activeColumnId;

            const activeColumnId = activeData.tasks.column_id;
            const overColumnId = overData?.column?.id || overData?.tasks?.column_id || activeColumnId;

            if (activeColumnId === overColumnId) {
                const activeColumn = columns.find(col => col.id === activeColumnId);
                const activeTaskIndex = activeColumn?.tasks.findIndex(task => `task-${task.id}` === active.id);
                const overTaskIndex = activeColumn?.tasks.findIndex(task => `task-${task.id}` === over.id);

                if (activeTaskIndex !== undefined && overTaskIndex !== undefined) {
                    const newTasks = arrayMove(activeColumn.tasks, activeTaskIndex, overTaskIndex);
                    setColumns(prevColumns => prevColumns.map(col =>
                        col.id === activeColumnId ? { ...col, tasks: newTasks } : col
                    ));

                    try {
                        const posisi = await axios.put(`http://127.0.0.1:8000/api/kanban/board/${id}/column-task/task-position/${active.id.replace("task-", "")}`, { position: overTaskIndex });
                        if (posisi) {
                            toast.success("Task Berhasil Dipindahkan");
                        } else {
                            toast.error("Tidak Bisa Memindahkan Task");
                        }
                    } catch (error) {
                        handleError(error);
                        toast.error("Tidak Bisa Memindahkan Task");
                    }
                }
            } else {
                const activeColumn = columns.find(col => col.id === activeColumnId);
                const overColumn = columns.find(col => col.id === overColumnId);
                const taskToMove = activeColumn.tasks.find(task => `task-${task.id}` === active.id);

                if (taskToMove) {
                    const updatedActiveTasks = activeColumn.tasks.filter(task => `task-${task.id}` !== active.id);
                    let newOverTasks;

                    if (overColumn.tasks.length === 0) {
                        newOverTasks = [{ ...taskToMove, column_id: overColumn.id }];
                    } else {
                        newOverTasks = [...(overColumn.tasks || []), { ...taskToMove, column_id: overColumn.id }];
                    }

                    setColumns(prevColumns => prevColumns.map(col => {
                        if (col.id === activeColumnId) {
                            return { ...col, tasks: updatedActiveTasks };
                        }
                        if (col.id === overColumnId) {
                            return { ...col, tasks: newOverTasks };
                        }
                        return col;
                    }));

                    try {
                        const columAndPosisi = await Promise.all([
                            axios.put(`http://127.0.0.1:8000/api/kanban/board/${id}/column-task/task-column/${taskToMove.id}`, { column_id: overColumn.id }),
                            axios.put(`http://127.0.0.1:8000/api/kanban/board/${id}/column-task/task-position/${taskToMove.id}`, { position: newOverTasks.length - 1 })
                        ]);

                        if (columAndPosisi) {
                            toast.success("Task Berhasil Dipindahkan");
                        } else {
                            toast.error("Tidak Bisa Memindahkan Task");
                        }
                    } catch (error) {
                        console.error('Error moving task to new column:', error);
                    }
                }
            }
        }

        else if (activeData?.type === "Column") {
            const activeIndex = columns.findIndex(col => col.id === active.id);
            const overIndex = columns.findIndex(col => col.id === over.id);

            if (activeIndex !== overIndex) {
                const newColumns = arrayMove(columns, activeIndex, overIndex);
                setColumns(newColumns);

                try {
                    const positionUpdates = newColumns.map((column, index) =>
                        axios.put(`http://127.0.0.1:8000/api/kanban/board/${id}/column-position/${column.id}`, { position: index })
                    );
                    const culum = await Promise.all(positionUpdates);
                    if (culum) {
                        toast.success("Column Berhasil Dipindahlan");
                    } else {
                        toast.error("Column Gagal Dipindahlan");
                    }
                } catch (error) {
                    console.error('Error updating column positions:', error);
                    setColumns(columns);
                    toast.warning("Something Wrong");
                }
            }
        }
    };





    const onDragOver = (event: DragOverEvent) => {
        const { active, over } = event;
        if (active.data.current?.type === "Task") {
            const overColumnId = over?.data.current?.column?.id;
            if (overColumnId) {
                const activeColumnId = active.data.current.tasks.column_id;
                if (activeColumnId !== overColumnId) {
                    setColumns((prevColumns) =>
                        prevColumns.map((col) =>
                            col.id === overColumnId ? { ...col, tasks: [...col.tasks] } : col
                        )
                    );
                }
            }
        }
    };

    const onDragEnds = async (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveColumn(null);
        setActiveTask(null);

        if (!over) return;

        const activeData = active.data.current;
        const overData = over.data.current;

        if (activeData?.type === "Task") {
            const activeColumnId = activeData.tasks.column_id;
            const overColumnId = overData?.column?.id || activeColumnId;

            if (activeColumnId === overColumnId) {
                const activeColumn = columns.find(col => col.id === activeColumnId);
                const activeTaskIndex = activeColumn?.tasks.findIndex(task => `task-${task.id}` === active.id);
                const overTaskIndex = activeColumn?.tasks.findIndex(task => `task-${task.id}` === over.id);

                if (activeTaskIndex !== undefined && overTaskIndex !== undefined) {
                    const newTasks = arrayMove(activeColumn.tasks, activeTaskIndex, overTaskIndex);
                    setColumns(prevColumns => prevColumns.map(col =>
                        col.id === activeColumnId ? { ...col, tasks: newTasks } : col
                    ));

                    try {
                        await axios.put(`http://127.0.0.1:8000/api/kanban/board/${id}/column-task/task-position/${active.id.replace("task-", "")}`, { position: overTaskIndex });
                    } catch (error) {
                        console.error('Error updating task position:', error);
                    }
                }
            } else {
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

                    try {
                        await Promise.all([
                            axios.put(`http://127.0.0.1:8000/api/kanban/board/${id}/column-task/task-column/${taskToMove.id}`, { column_id: overColumn.id }),
                            axios.put(`http://127.0.0.1:8000/api/kanban/board/${id}/column-task/task-position/${taskToMove.id}`, { position: newOverTasks.length - 1 })
                        ]);
                    } catch (error) {
                        console.error('Error moving task to new column:', error);
                    }
                }
            }
        }
        else if (activeData?.type === "Column") {
            const activeIndex = columns.findIndex(col => col.id === active.id);
            const overIndex = columns.findIndex(col => col.id === over.id);

            if (activeIndex !== overIndex) {
                const newColumns = arrayMove(columns, activeIndex, overIndex);
                setColumns(newColumns);

                try {
                    const positionUpdates = newColumns.map((column, index) =>
                        axios.put(`http://127.0.0.1:8000/api/kanban/board/column-position/${column.id}`, { position: index })
                    );
                    await Promise.all(positionUpdates);
                } catch (error) {
                    console.error('Error updating column positions:', error);
                    setColumns(columns);
                }
            }
        }
    };

    return (

        <div>

            {/* <button onClick={openModal} className="py-2 px-5 float-right rounded bg-orange-300 hover:bg-orange-500 font-semibold mr-2">
                Edit Board
            </button>
            <button onClick={deleteBoard} className="py-2 px-5 float-right rounded bg-red-300 hover:bg-red-500 font-semibold">
                Delete Board
            </button> */}


            <div >
                <div className="mb-20">
                    <div className="flex justify-between items-center mb-4">
                        <div className="grid gap-2 grid-cols-1">
                            <div className="flex items-center mb-3">
                                {permissions?.manage_board ? <i onClick={openModal} className="fa-solid fa-gear text-2xl mr-2 cursor-pointer" /> : ''}
                                <h1 className="text-4xl font-bold">{board.name}</h1>
                            </div>
                            <p className="text-sm font-semibold">{new Date(board.created_at).toLocaleDateString()}</p>
                            <hr className="h-0.5 bg-black px-20" />
                            {permissions?.manage_board ? (<button
                                onClick={HandleCreateColumn}
                                className='flex items-center justify-center h-[24px] w-[170px] font-semibold text-center cursor-pointer rounded-lg bg-white border-2 border-black p-2 text-xs ring-black hover:ring-2'
                                disabled={!board}
                            >
                                <i className="fa-solid fa-chart-simple mr-1"></i>
                                + Add New Column
                            </button>
                            ) : ('')}
                        </div>


                        <div className="grid grid-cols gap-2 mr-20">
                            <div className="flex">
                                {collaborators.length > 0 ? (
                                    <div className="flex flex-col items-center">
                                        <div className="flex">
                                            {collaborators.slice(0, 3).map((collaborator) => (
                                                <div key={collaborator.id} className="flex flex-col items-center justify-between pb-2 mr-2">
                                                    <img
                                                        src={'/src/assets/avatar/' + collaborator.user.avatar}
                                                        alt={collaborator.user.name}
                                                        className="w-10 h-10 border rounded-full mb-1"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                        <p className="text-sm text-center font-semibold">
                                            {collaborators.length > 3 ?
                                                `${collaborators.slice(0, 3).map(c => c.user.name).join(', ')}, ...` :
                                                collaborators.map(c => c.user.name).join(', ')
                                            }
                                        </p>

                                    </div>

                                ) : (
                                    '')}
                            </div>
                            <hr className="h-0.5  bg-black " />

                            <div className="">
                                {permissions?.add_members ? (<button
                                    onClick={() => setCollaborator(true)}
                                    className='flex items-center justify-center h-[24px] w-[170px] font-semibold text-center cursor-pointer rounded-lg bg-white border-2 border-black p-2 text-xs ring-black hover:ring-2'
                                >
                                    <i className="fa-solid fa-user mr-1"></i>
                                    Invite Collaborator
                                </button>
                                ) : ('')}

                            </div>


                        </div>


                    </div>
                </div>

                <div className="m-auto flex  w-full items-center overflow-x-auto overflow-y-hidden px-[40px]">
                    <DndContext onDragStart={onDragStart} onDragEnd={onDragEnd} sensors={sensors} onDragOver={onDragOver} >
                        <div className="m-auto flex gap-4">
                            {columns.length > 0 || columns.length != 0 ? (<SortableContext items={columnsId}>
                                {columns.map(colum => (
                                    <ColumnContainer
                                        key={colum.id}
                                        column={colum}
                                        ColumnUpdate={ColumnUpdate}
                                        deleteColumn={DeleteColumn}
                                        createTask={createTask}
                                        EditTask={EditTask}
                                        deleteTask={deleteTask}
                                        tasks={colum.tasks}
                                        permissions={permissions}
                                    />
                                ))}
                            </SortableContext>) : (<div>
                                No Column
                            </div>)}


                        </div>
                        {
                            createPortal(
                                <DragOverlay>
                                    {activeColumn && (
                                        <ColumnContainer
                                            column={activeColumn}
                                            ColumnUpdate={ColumnUpdate}
                                            deleteColumn={DeleteColumn}
                                            createTask={createTask}
                                            EditTask={EditTask}
                                            tasks={activeColumn.tasks}
                                            permissions={permissions}
                                            deleteTask={deleteTask}
                                        />
                                    )}
                                    {activeTask && (<TaskContainer tasks={activeTask} EditTask={EditTask} deleteTask={deleteTask}
                                    />)}
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
                            BoardMake={board.user_id}
                            DeleteBoard={deleteBoard}
                        />
                    )}
                    {collaborator && (
                        <CollaboratorModal
                            boardId={id}
                            isOpen={collaborator}
                            onClose={closeCollaborator}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
