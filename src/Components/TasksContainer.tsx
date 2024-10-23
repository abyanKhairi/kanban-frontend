import { useState } from "react";
import { Tasks } from "../Models/Board";
import { Button, Modal } from "flowbite-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Props {
    tasks: Tasks;
}

export default function TaskContainer({ tasks }: Props) {
    const [openModal, setOpenModal] = useState(false);

    const { setNodeRef: setTaskRef, attributes: taskAttributes, listeners: taskListeners, transform: taskTransform, transition: taskTransition, isDragging: isTaskDragging } = useSortable({
        id: `task-${tasks.id}`,
        data: {
            type: "Task",
            tasks,
        },
    });



    const style = {
        taskTransition,
        transform: CSS.Transform.toString(taskTransform),
    };

    if (isTaskDragging) {
        return <div
            className=" opacity-30 bg-slate-600 p-2.5 h-[100px] min-h-[100px] flex items-center text-left rounded-xl border-2 border-rose-500  cursor-grap relative"
            ref={setTaskRef}
            style={style}
        />
    }

    return (
        <>
            <div
                ref={setTaskRef}
                style={style}
                {...taskAttributes}
                {...taskListeners}
                onDoubleClick={() => setOpenModal(true)}
                className="bg-slate-600 p-2.5 h-[100px] min-h-[100px] flex items-center text-left rounded-xl hover:ring-2 hover:ring-inset hover:ring-rose-400 cursor-pointer relative"
                role="button"
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        setOpenModal(true);
                    }
                }}
            >
                <p className="my-auto h-[90%] w-full overflow-y-auto overflow-x-hidden whitespace-pre-wrap">
                    {tasks.title + " Halo " + tasks.id}
                </p>
            </div>
            <Modal show={openModal} onClose={() => setOpenModal(false)}>
                <Modal.Header>{tasks.title}</Modal.Header>
                <Modal.Body>
                    <div className="space-y-6">
                        <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                            {tasks.description || "No description available."}
                        </p>
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
