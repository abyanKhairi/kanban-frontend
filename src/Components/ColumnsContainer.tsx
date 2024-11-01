import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useMemo, useState } from "react";
import { Columns, Id, Tasks } from "../Models/Board";
import { useParams } from "react-router-dom";
import TaskContainer from "./TasksContainer";
import line from "../assets/VELO/line.png"

interface Props {
    column: Columns;
    deleteColumn: (id: Id) => void;
    ColumnUpdate: (board_id: Id, id: Id, name: string) => void;
    createTask: (columnId: Id) => void;
    EditTask: (id: Id, title: string, deadline?: Date, description?: string, status?: string) => void;
    tasks: Tasks[];
    permissions: []
    deleteTask: (column_id: Id, task_id: Id) => void;

}

export default function ColumnContainer(props: Props) {
    const { id } = useParams<{ id: string }>();
    const { column, ColumnUpdate, deleteColumn, createTask, tasks, EditTask, permissions, deleteTask } = props;
    const [editMode, setEditMode] = useState(false);
    const [inputValue, setInputValue] = useState(column.name); // Local state for input value
    const { setNodeRef: setColumnRef, attributes: columnAttributes, listeners: columnListeners, transform: columnTransform, transition: columnTransition, isDragging: isColumnDragging } = useSortable({
        id: column.id,
        data: {
            type: "Column",
            column,
        },
        disabled: editMode || !permissions?.manage_board,
    });
    const style = {
        transition: columnTransition,
        transform: CSS.Transform.toString(columnTransform),
    }

    const tasksIds = useMemo(() => {
        return tasks.map(task => `task-${task.id}`);
    }, [tasks]);

    const handleColumnUpdate = () => {
        ColumnUpdate(id, column.id, inputValue);
        setEditMode(false);
    };


    // const colors = {
    //     green: '#7ecd50',
    //     blue: '#54afe5',
    //     red: '#f1487a',
    //     yellow: '#fbcb41',
    // };

    // function pickRandomColor() {
    //     const colorKeys = Object.keys(colors);
    //     const randomKey = colorKeys[Math.floor(Math.random() * colorKeys.length)];
    //     return colors[randomKey];
    // }

    // const randomColor = pickRandomColor(); 

    const getBackgroundColor = () => {
        const colors = ["bg-pink-500", "bg-blue-500", "bg-yellow-300", "bg-lime-500"];
        return colors[(column.id - 1) % colors.length];
    };

    const getDragColor = () => {
        const colors = ["border-rose-600", "border-blue-400", "border-yellow-400", "border-lime-500"];
        return colors[(column.id - 1) % colors.length];
    };

    const getInputColor = () => {
        const colors = ["bg-pink-600", "bg-blue-600", "bg-yellow-400", "bg-lime-600"];
        return colors[(column.id - 1) % colors.length];
    };

    if (isColumnDragging) {
        return <div ref={setColumnRef} style={style} className={` ${getDragColor()} opacity-60 w-[350px] max-h-[500px]  cursor-pointer rounded-lg  border-2 flex flex-col`}></div>;
    }

    return (
        <div className="w-80 rounded-lg p-4 flex flex-col gap-3">
            <div
                ref={setColumnRef}
                style={style}
                className={`rounded-lg flex flex-col  ${isColumnDragging ? 'h-[500px] w-[350px] min-h-[500px]' : ''} max-h-[500px]   overflow-auto`}>
                <div
                    {...columnAttributes}
                    {...columnListeners}
                    onDoubleClick={() => { setEditMode(true); setInputValue(column.name); }}
                    className={`${getBackgroundColor()} text-md mb-1 text-white h-[55px] cursor-grab rounded-t-xl rounded-b-none p-4 font-bold flex items-center justify-between relative`}
                >
                    <div
                        className="absolute inset-0 rounded-t-lg"
                        style={{
                            backgroundImage: `url(${line})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            opacity: 0.2,
                        }}
                    />

                    <div className="flex gap-2">
                        {!editMode && <h3 className="font-bold text-lg">{column.name}</h3>}
                        {editMode && (
                            <input
                                className={`${getInputColor()}  focus:border-slate-200 border rounded outline-none px-1`}
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                autoFocus
                                onBlur={() => setEditMode(false)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        handleColumnUpdate();
                                    } else if (e.key === "Escape") {
                                        setEditMode(false);
                                    }
                                }}
                            />
                        )}
                        <div className="my-1 px-2 pt-[2px]  font-medium bg-white text-center text-slate-500 rounded-full text-xs">
                            {column.tasks.length}
                        </div>
                    </div>
                    {permissions?.manage_board ?
                        (<button onClick={() => deleteColumn(column.id)} className={`${editMode ? 'hidden' : 'block'} text-white hover:text-rose-700 rounded px-2 z-10`}>
                            <i className="fas fa-trash-alt"></i>
                        </button>)
                        :
                        ('')
                    }
                </div>



                <div className="flex-grow p-2 flex flex-col gap-4 overflow-y-auto max-h-[30rem] w-72">
                    <SortableContext items={tasksIds}>
                        {tasks.map(task => (
                            <TaskContainer key={`task-${task.id}`} tasks={task} EditTask={EditTask} permissions={permissions} deleteTask={deleteTask} columnId={column.id} />
                        ))}
                    </SortableContext>
                </div>
                {permissions?.add_cards ? (<button
                    onClick={() => createTask(column.id)}
                    className="w-72 text-gray-700 border-2 mt-[7px] rounded-lg py-[11px] hover:bg-gray-100">
                    + New Task
                </button>) : ('')}
            </div>
        </div>
    );
}
