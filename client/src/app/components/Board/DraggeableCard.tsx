import { CardType } from "@/lib/types";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import CardItem from "./CardItem";

interface CardProps {
	card: CardType;
	openForm?: (card?: CardType) => void;
}

export default function DraggeableCard({
	card,
	openForm,
}: Readonly<CardProps>) {
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
		opacity: isDragging ? 0.5 : 1,
	};

	return (
		<div ref={setNodeRef} {...attributes} {...listeners} style={style}>
			<CardItem card={card} openForm={openForm} />
		</div>
	);
}
