import { useEffect, useState } from "react";
import { Id, Tasks } from "../Models/Board";
import { Modal } from "flowbite-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useAuth } from "../Context/useAuth";
import { useParams } from "react-router-dom";

interface Props {
    tasks: Tasks;
    EditTask: (board_id: number, id: Id, title: string, deadline?: Date, description?: string, status?: string) => void,
    permissions: []
    deleteTask: (column_id: Id, task_id: Id) => void;
    column_id: number
}

export default function TaskContainer(props: Props) {
    const { id } = useParams<{ id: string }>();
    const { tasks, EditTask, permissions, column_id, deleteTask } = props
    const [openModal, setOpenModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [editDes, setEditDes] = useState(false);
    const [titleValue, setTitleValue] = useState(tasks.title);
    const [descriptionValue, setDescriptionValue] = useState(tasks.description);
    const [statusValue, setStatusValue] = useState(tasks.status);
    const [deadlineValue, setDeadlineValue] = useState(tasks.deadline);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showOptions, setShowOptions] = useState(false);
    const { user } = useAuth();
    const canManageBoard = permissions?.manage_board
    const canEditTask = permissions?.edit_cards
    const userTask = tasks.user_id === user.id
    const { setNodeRef: setTaskRef, attributes: taskAttributes, listeners: taskListeners, transform: taskTransform, transition: taskTransition, isDragging: isTaskDragging } = useSortable({
        id: `task-${tasks.id}`,
        data: {
            type: "Task",
            tasks,
        },
        disabled: editMode || (!canManageBoard && !userTask)
    });

    const style = {
        transition: taskTransition,
        transform: CSS.Transform.toString(taskTransform),
    };

    if (isTaskDragging) {
        return (
            <div
                ref={setTaskRef}
                style={{
                    ...style,
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    transform: `${style.transform} scale(1.05)`,
                    boxShadow: '0 8px 15px rgba(0, 0, 0, 0.2)',
                    opacity: 0.9,
                }}
                className="p-2.5 flex items-center text-left rounded-xl border-2 bg-gradient-to-r from-blue-500 to-indigo-600 cursor-grabbing"
            />
        );
    }

    const handleEditTaskTitle = () => {
        if (!titleValue.trim()) return;
        EditTask(id, tasks.id, titleValue);
        setEditMode(false);
    }


    const handleEditDescription = () => {
        EditTask(id, tasks.id, titleValue, deadlineValue, descriptionValue, statusValue);
        setEditDes(false);

    }


    const modules = {
        toolbar: [
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            [{ font: [] }],
            [{ size: [] }],
            ["bold", "italic", "underline", "strike", "blockquete"],
            [
                { list: "ordered" },
                { list: "bullet" },
                { indent: "-1" },
                { indent: "+1" },
            ],
            ["link"]
        ]
    }


    const handleIconClock = () => {
        setShowDatePicker(!showDatePicker);
    };

    const handleDateChange = (e) => {
        const tanggal = e.target.value
        setDeadlineValue(tanggal);
        EditTask(id, tasks.id, titleValue, tanggal, descriptionValue, statusValue);

        setShowDatePicker(false);
    };


    const handleIconBar = () => {
        setShowOptions(!showOptions);
    };

    const handleStatusChange = (e) => {
        const status = e.target.value;
        setStatusValue(status);
        EditTask(id, tasks.id, titleValue, deadlineValue, descriptionValue, status);
        setShowOptions(false);
    };


    return (
        <>
            <div
                ref={setTaskRef}
                style={style}
                {...taskAttributes}
                {...taskListeners}
                onDoubleClick={() => setOpenModal(true)}
                className={`bg-white border ${userTask ? `border-[#54afe5]` : `border-[#f1487a]`}  p-2.5 h-[50px] min-h-[50px] flex items-center text-center rounded-lg shadow-md cursor-pointer ${userTask ? `hover:bg-[#bce6ff]` : `hover:bg-[#ffbbd0]`} `}>
                <p className="text-gray-700 overflow-hidden whitespace-pre-wrap ">
                    {tasks.title}
                </p>
            </div >

            <Modal show={openModal} onClose={() => setOpenModal(false)}>
                <Modal.Header className="bg-gray-200 border-b border-gray-300">
                    <div className="flex items-center justify-between w-full">
                        {
                            !editMode ? (
                                (canManageBoard || userTask || canEditTask) ? (
                                    <h2
                                        className="font-bold text-lg text-gray-800 cursor-pointer"
                                        onDoubleClick={() => setEditMode(true)}
                                    >
                                        {tasks.title}
                                    </h2>
                                ) : (
                                    <h2 className="font-bold text-lg text-gray-800">
                                        {tasks.title}
                                    </h2>
                                )
                            ) : (
                                <input
                                    type="text"
                                    className="border border-gray-400 rounded-md p-2 w-full text-lg"
                                    value={titleValue}
                                    onBlur={() => setEditMode(false)}
                                    onChange={(e) => setTitleValue(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            handleEditTaskTitle();
                                        } else if (e.key === "Escape") {
                                            setEditMode(false);
                                        }
                                    }}
                                />
                            )
                        }
                    </div>
                </Modal.Header>
                <Modal.Body className="p-4">
                    <div className="my-5 flex mb-12 justify-between">
                        <div className="relative">

                            {(canManageBoard || canEditTask || userTask) ? (
                                <div className="flex items-center space-x-2 cursor-pointer" onClick={handleIconBar}>
                                    <i className="fa-solid fa-bars-progress"></i>
                                    <span>{statusValue}</span>
                                </div>
                            ) : (<div className="flex items-center space-x-2" >
                                <i className="fa-solid fa-bars-progress"></i>
                                <span>{statusValue}</span>
                            </div>)}



                            {showOptions && (
                                <select
                                    value={statusValue}
                                    onChange={handleStatusChange}
                                    className="absolute mt-2 border border-gray-300 rounded px-2 py-1"
                                >
                                    <option value="To Do">To Do</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Completed">Completed</option>
                                </select>
                            )}
                        </div>
                        <div className="flex items-center space-x-2">
                            {(canManageBoard || canEditTask || userTask) ? (<i
                                className="fa-solid fa-clock cursor-pointer text-blue-500"
                                onClick={handleIconClock}
                            ></i>) : (<i
                                className="fa-solid fa-clock  text-blue-500"
                            ></i>)}
                            <span>{deadlineValue || 'No date set'}</span>

                            {showDatePicker && (
                                <input
                                    type="date"
                                    value={deadlineValue}
                                    onChange={handleDateChange}
                                    className="border border-gray-300 rounded px-2 py-1"
                                />
                            )}
                        </div>
                    </div>



                    <div className="space-y-6">
                        {!editDes ? (
                            (canManageBoard || userTask || canEditTask) ? (<div
                                onDoubleClick={() => setEditDes(true)}
                                className="border border-gray-200 p-2 rounded-md bg-gray-50 cursor-pointer"
                            >
                                <div
                                    className="prose text-gray-700 whitespace-pre-wrap"
                                    dangerouslySetInnerHTML={{
                                        __html: descriptionValue || "No description available"
                                    }}
                                />
                            </div>) : (
                                <div
                                    className="border border-gray-200 p-2 rounded-md bg-gray-50 "
                                >
                                    <div
                                        className="prose text-gray-700 whitespace-pre-wrap"
                                        dangerouslySetInnerHTML={{
                                            __html: descriptionValue || "No description available"
                                        }}
                                    />
                                </div>

                            )
                        ) : (
                            <ReactQuill
                                theme="snow"
                                value={descriptionValue}
                                onChange={setDescriptionValue}
                                className="border border-gray-300 rounded-lg"
                                modules={modules}
                                onKeyDown={
                                    (e) => {
                                        if (e.key === "Enter" && e.shiftKey) {
                                            handleEditDescription();
                                            setEditDes(false);
                                        } else if (e.key === "Escape") {
                                            setEditDes(false);
                                        }
                                    }}
                            />
                        )}

                    </div>
                    {!editDes ? '' : (
                        <div className="flex justify-between">
                            <button onClick={() => handleEditDescription()} className="border border-green-500 py-2 px-3 rounded-lg mt-5 text-green-500">save</button>
                            <button onClick={() => setEditDes(false)} className="border border-red-500 py-2 px-3 rounded-lg mt-5 text-red-500">Cancel</button>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer className="flex justify-between">
                    <button
                        className="border border-yellow-500 py-2 px-4 rounded-lg text-yellow-500 font-semibold hover:bg-yellow-500 hover:text-white transition duration-150 ease-in-out"
                        onClick={() => deleteTask(column_id, tasks.id)} color="red">
                        Delete Task
                    </button>
                    <button
                        className="border border-red-500 py-2 px-4 rounded-lg text-red-500 font-semibold hover:bg-red-500 hover:text-white transition duration-150 ease-in-out"
                        onClick={() => setOpenModal(false)} color="red">
                        Close
                    </button>

                </Modal.Footer>
            </Modal>
        </>
    );
}
