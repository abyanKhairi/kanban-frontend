import { useState } from "react";
import { Tasks } from "../Models/Board";
import { Button, Modal } from "flowbite-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Props {
    tasks: Tasks; // Adjusted to singular task
}

export default function TaskContainer({ tasks }: Props) {
    const [openModal, setOpenModal] = useState(false);

    const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
        id: tasks.id,
        data: {
            type: "Task",
            tasks,
        },
        // disabled: editMode,
    });
    // console.log(tasks.id)
    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
    };

    if (isDragging) {
        return <div
            className=" opacity-30 bg-slate-600 p-2.5 h-[100px] min-h-[100px] flex items-center text-left rounded-xl border-2 border-rose-500  cursor-grap relative"
            ref={setNodeRef}
            style={style}
        />
    }

    return (
        <>
            <div
                ref={setNodeRef}
                style={style}
                {...attributes}
                {...listeners}
                onDoubleClick={() => setOpenModal(true)}
                className="bg-slate-600 p-2.5 h-[100px] min-h-[100px] flex items-center text-left rounded-xl hover:ring-2 hover:ring-inset hover:ring-rose-400 cursor-pointer relative"
                tabIndex={0} // Makes the div focusable
                role="button" // Indicates it's an interactive element
                onKeyDown={(e) => { // Enables keyboard interaction
                    if (e.key === 'Enter' || e.key === ' ') {
                        setOpenModal(true);
                    }
                }}
            >
                <p className="my-auto h-[90%] w-full overflow-y-auto overflow-x-hidden whitespace-pre-wrap">
                    {tasks.title}
                </p>
            </div>
            <Modal show={openModal} onClose={() => setOpenModal(false)}>
                <Modal.Header>{tasks.title}</Modal.Header> {/* Changed to show task title */}
                <Modal.Body>
                    <div className="space-y-6">
                        <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                            {/* You can customize this content with task details */}
                            {tasks.description || "No description available."}
                        </p>
                        {/* Add any other task-specific information here */}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => setOpenModal(false)}>Close</Button>
                    <Button color="gray" onClick={() => setOpenModal(false)}>
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
