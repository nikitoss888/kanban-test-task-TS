import { closestCorners, DndContext, PointerSensor, useSensor, useSensors, DragEndEvent, DragOverlay, DragStartEvent } from "@dnd-kit/core";
import { moveCard } from "@/lib/store/slices/boardSlice";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import Column from "./Column";
import { ColumnType } from "@/lib/types";
import { useState } from "react";
import Card from "./Card";

export default function Containers() {
    const [activeCardId, setActiveCardId] = useState<string | null>(null);

    const dispatch = useAppDispatch();
    const cards = useAppSelector(state => state.board.cards);

    const sensors = useSensors(useSensor(PointerSensor))

    const handleDragStart = (event: DragStartEvent) => {
        setActiveCardId(event.active.id as string);
    }
    
    const handleDragEnd = (event: DragEndEvent) => {
        setActiveCardId(null);
        const { active, over } = event;

        if (!over || active.id === over.id) return;

        const sourceCard = cards[active.id];
        const targetCard = cards[over.id];

        const newColumn = targetCard.column;
        const newOrder = targetCard.order;

        console.log({
            id: sourceCard.id,
            title: sourceCard.title,
            columnFrom: sourceCard.column,
            orderFrom: sourceCard.order,
            columnTo: newColumn,
            orderTo: newOrder,
        })

        dispatch(moveCard({ id: sourceCard.id, column: newColumn, order: newOrder }));
    };

    const getCardsByColumn = (type: ColumnType) => {
        return {
            type,
            cards: Object.values(cards).filter(card => card.column == type)
        }
    }

	return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <div className="flex w-full gap-4">
                <Column {...getCardsByColumn('TODO')} />
                <Column {...getCardsByColumn('IN_PROGRESS')} />
                <Column {...getCardsByColumn('DONE')} />
            </div>

            <DragOverlay>
                {activeCardId ? (
                    <Card card={cards[activeCardId]} isOverlay />
                ) : null}
            </DragOverlay>
        </DndContext>
    );
}
