import { CardType } from "@/lib/types"
import { CSS } from '@dnd-kit/utilities';
import { useSortable } from "@dnd-kit/sortable";

interface CardProps {
    card: CardType;
    isOverlay?: boolean;
}

export default function Card({ card, isOverlay = false }: Readonly<CardProps>) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: card.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging && !isOverlay ? 0 : 1,
        zIndex: isOverlay ? 9999 : undefined,
    }

    return (
        <div
            ref={isOverlay ? undefined : setNodeRef}
            {...(isOverlay ? {} : attributes)}
            {...(isOverlay ? {} : listeners)}
            style={style}
            className={`bg-black p-2 shadow rounded mb-2 ${isDragging && !isOverlay ? 'hidden' : ''}`}
        >
            <p className="font-medium">{card.title}</p>
            <p className="text-sm text-gray-600">{card.description}</p>
        </div>
    );
}