import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useMemo, useState } from "react";
import { Columns, Id, Tasks } from "../Models/Board";
import { useParams } from "react-router-dom";
import TaskContainer from "./TasksContainer";

interface Props {
    column: Columns;
    deleteColumn: (id: Id) => void;
    ColumnUpdate: (board_id: Id, id: Id, name: string) => void;
    createTask: (columnId: Id) => void;
    tasks: Tasks[];
}

export default function ColumnContainer(props: Props) {
    const { id } = useParams<{ id: string }>();
    const { column, ColumnUpdate, deleteColumn, createTask, tasks } = props;
    const [editMode, setEditMode] = useState(false);
    const [inputValue, setInputValue] = useState(column.name); // Local state for input value
    const { setNodeRef: setColumnRef, attributes: columnAttributes, listeners: columnListeners, transform: columnTransform, transition: columnTransition, isDragging: isColumnDragging } = useSortable({
        id: column.id,
        data: {
            type: "Column",
            column,
        },
        disabled: editMode,
    });

    const style = {
        columnTransition,
        transform: CSS.Transform.toString(columnTransform),
    };

    const tasksIds = useMemo(() => {
        return tasks.map(task => `task-${task.id}`)
    }, [tasks])

    const handleColumnUpdate = () => {
        ColumnUpdate(id, column.id, inputValue);
        setEditMode(false);
    };

    if (isColumnDragging) {
        return <div ref={setColumnRef} style={style} className="h-[500px] border-rose-600 opacity-60 w-[350px] min-h-[500px] cursor-pointer rounded-lg bg-mainBackgoundColor border-2 flex flex-col"></div>;
    }

    return (
        <div className="flex flex-col gap-3">
            <div
                ref={setColumnRef}
                style={style}
                className="h-[500px] w-[350px] min-h-[500px] cursor-pointer rounded-lg bg-mainBackgoundColor border-2 flex flex-col">

                <div
                    {...columnAttributes}
                    {...columnListeners}
                    onDoubleClick={() => { setEditMode(true); setInputValue(column.name); }} // Set inputValue to current name
                    className="bg-mainBackgroundColor text-md h-[60px] cursor-grab rounded rounded-b-none p-3 font-bold border-4 flex items-center justify-between">

                    <div className="flex gap-2">
                        <div className="flex text-white rounded-full justify-center items-center bg-slate-700 px-2 py-1 text-sm">
                            {column.tasks.length + " Halo " + column.id} {/* Menampilkan jumlah tugas */}
                        </div>
                        {!editMode && column.name}
                        {editMode && (
                            <input
                                className="bg-slate-600 focus:border-rose-400 border rounded outline-none px-2"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                autoFocus
                                onBlur={() => {
                                    setEditMode(false);
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        handleColumnUpdate();
                                    } else if (e.key === "Escape") {
                                        setEditMode(false);
                                    }
                                }}
                            />
                        )}
                    </div>
                    <button onClick={() => { deleteColumn(column.id); }} className="stroke-gray-500 hover:stroke-white hover:bg-slate-700 rounded px-1 py-2">
                        Hapus
                    </button>
                </div>

                <div className="flex flex-grow flex-col gap-4 p-2 overflow-x-hidden overflow-y-auto">
                    <SortableContext items={tasksIds}>
                        {tasks.map(task => (
                            <TaskContainer key={`task-${task.id}`} tasks={task} />
                        ))}
                    </SortableContext>
                </div>
            </div>
            <div
                className="flex gap-2 items-center border-gray-500 border-2 rounded-md p-4">
                <button onClick={() => createTask(column.id)}>Add Task</button>
            </div>
        </div>
    );
}
