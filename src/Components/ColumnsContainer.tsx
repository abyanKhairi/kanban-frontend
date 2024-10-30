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

    if (isColumnDragging) {
        return <div ref={setColumnRef} style={style} className=" border-[#7ecd50] opacity-60 w-[350px] max-h-[500px]  cursor-pointer rounded-lg  border-2 flex flex-col"></div>;
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
                    onDoubleClick={permissions?.manage_board ? () => {
                        setEditMode(true);
                        setInputValue(column.name);
                    } : undefined}
                    className="text-gray-900  p-2 bg-[#fbcb41] flex justify-between items-center rounded-t-lg relative"
                >
                    <div
                        className="absolute inset-0 rounded-t-lg"
                        style={{
                            backgroundImage: `url(${line})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            opacity: 0.4,
                        }}
                    />

                    <div className="flex gap-2">
                        {!editMode && <h3 className="font-bold">{column.name}</h3>}
                        {editMode && (
                            <input
                                className="bg-pink-600 focus:border-rose-400 border rounded outline-none px-2"
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
                        <div className="bg-white text-center text-pink-500 rounded-full text-sm w-8 py-1">
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



                <div className="flex-grow p-2 flex flex-col gap-4 overflow-y-auto max-h-[30rem]">
                    <SortableContext items={tasksIds}>
                        {tasks.map(task => (
                            <TaskContainer key={`task-${task.id}`} tasks={task} EditTask={EditTask} permissions={permissions} deleteTask={deleteTask} column_id={column.id} />
                        ))}
                    </SortableContext>
                </div>


            </div>

            {
                permissions?.add_cards ? (<button
                    onClick={() => createTask(column.id)}
                    className="w-full mt-4 text-gray-700 border rounded-lg py-2 hover:bg-gray-100">
                    + New Task
                </button>) : ('')
            }


        </div >
    );
}
