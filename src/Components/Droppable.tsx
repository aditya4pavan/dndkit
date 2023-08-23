import { useDroppable } from "@dnd-kit/core";
import { rectSortingStrategy, SortableContext } from "@dnd-kit/sortable";
import { SortableItem } from "./SortableItem";
import React from "react";
import Paper from '@mui/material/Paper';


const Droppable = ({ id, items }: any) => {
    const { setNodeRef, active } = useDroppable({ id });
    const isOver = active?.data.current?.sortable.containerId === id
    return (
        <SortableContext id={id} items={items} strategy={rectSortingStrategy}>
            <Paper elevation={3} className="flex flex-col h-full min-w-[200px] grow">
                <p className="text-xl capitalize py-2 px-4 ">{id}</p>
                <div ref={setNodeRef} className={`py-4 flex-grow space-y-1 ${isOver ? 'bg-gray-200' : 'bg-gray-100'}`}>
                    {items.map((item: any) => (
                        <SortableItem key={item} id={item}>
                            {item}
                        </SortableItem>
                    ))}
                </div>
            </Paper>
        </SortableContext>
    );
};

export default Droppable;
