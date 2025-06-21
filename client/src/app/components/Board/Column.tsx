import { CardType, ColumnType } from "@/lib/types";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { map } from "framer-motion/client";
import Card from "./Card";

interface ColumnProps {
    type: ColumnType;
    cards: CardType[];
}

export default function Column({ type, cards }: Readonly<ColumnProps>) {
    
    let title;
    let classes;
    switch(type) {
        case 'TODO':
            title = "To Do";
            classes = 'bg-blue-500'
            break;
        case 'IN_PROGRESS':
            title = 'In Progress';
            classes = 'bg-yellow-500'
            break;
        case 'DONE':
            title = 'Done';
            classes = 'bg-green-500'
            break;
    }

    return (
        <div className="w-1/3">
            <h2 className="font-bold mb-4 text-lg">{title}</h2>
            <div className={`${classes} w-full h-full p-4 rounded-sm`}>
                <SortableContext
                    items={cards.map(card => card.id)}
                    strategy={verticalListSortingStrategy}
                >
                    {cards.map(card =>(
                        <Card key={card.id} card={card} />
                    ))}
                </SortableContext>
            </div>
        </div>
    );
}