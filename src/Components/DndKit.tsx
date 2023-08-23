import React, { useState } from "react";
import {
    DndContext,
    KeyboardSensor,
    PointerSensor,
    useDroppable,
    useSensor,
    useSensors
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import Droppable from "./Droppable";
import { arrayMove as dndKitArrayMove } from "@dnd-kit/sortable";


export const removeAtIndex = (array: any, index: number) => {
    return [...array.slice(0, index), ...array.slice(index + 1)];
};

export const insertAtIndex = (array: any, index: number, item: any) => {
    return [...array.slice(0, index), item, ...array.slice(index)];
};

export const arrayMove = (array: any, oldIndex: number, newIndex: number) => {
    return dndKitArrayMove(array, oldIndex, newIndex);
};

declare global {
    interface Window {
        hbspt: any;
    }
}

function App() {
    const [items, setItems] = useState<any>({
        group1: ["1", "2", "3"],
        group2: ["4", "5", "6"],
        group3: ["7", "8", "9"]
    });

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates
        })
    );


    const handleDragOver = ({ over, active }: any) => {

        const overId = over?.id;

        if (!overId) {
            return;
        }

        const activeContainer = active.data.current.sortable.containerId;
        const overContainer = over.data.current?.sortable.containerId || over.id;

        if (activeContainer !== overContainer) {
            setItems((items: any) => {
                const activeIndex = active.data.current.sortable.index;
                const overIndex = over.data.current?.sortable.index || 0;

                return moveBetweenContainers(
                    items,
                    activeContainer,
                    activeIndex,
                    overContainer,
                    overIndex,
                    active.id
                );
            });
        }
    };

    const handleDragEnd = ({ active, over }: any) => {
        if (!over) {
            return;
        }

        if (active.id !== over.id) {
            const activeContainer = active.data.current.sortable.containerId;
            const overContainer = over.data.current?.sortable.containerId || over.id;
            const activeIndex = active.data.current.sortable.index;
            const overIndex = over.data.current?.sortable.index || 0;

            setItems((items: any) => {
                let newItems;
                if (activeContainer === overContainer) {
                    newItems = {
                        ...items,
                        [overContainer]: arrayMove(
                            items[overContainer],
                            activeIndex,
                            overIndex
                        )
                    };
                } else {
                    newItems = moveBetweenContainers(
                        items,
                        activeContainer,
                        activeIndex,
                        overContainer,
                        overIndex,
                        active.id
                    );
                }

                return newItems;
            });
        }
    };

    const moveBetweenContainers = (
        items: any,
        activeContainer: any,
        activeIndex: any,
        overContainer: any,
        overIndex: any,
        item: any
    ) => {
        return {
            ...items,
            [activeContainer]: removeAtIndex(items[activeContainer], activeIndex),
            [overContainer]: insertAtIndex(items[overContainer], overIndex, item)
        };
    };

    const handleAdd = () => {
        const count = Object.keys(items).length
        setItems({ ...items, [`group${count + 1}`]: [] })
    }

    const { setNodeRef } = useDroppable({ id: 'group' });

    return (
        <div className="container mx-auto flex flex-col w-screen h-screen">
            <DndContext
                sensors={sensors}
                onDragEnd={handleDragEnd}
                onDragOver={handleDragOver}
            >
                <button className="rounded m-1 outline outline-2 p-2 w-48 outline-blue-500" onClick={handleAdd}>Add New Group</button>
                <div ref={setNodeRef} className="flex gap-2 flex-grow py-5">
                    {Object.keys(items).map((group: any) => (
                        <Droppable id={group} items={items[group]} key={group} />
                    ))}

                </div>
            </DndContext>
        </div>
    );
}

export default App;
