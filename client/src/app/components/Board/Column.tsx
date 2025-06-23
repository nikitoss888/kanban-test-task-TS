import { CardType, ColumnType } from "@/lib/types";
import {
	SortableContext,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import DraggeableCard from "./DraggeableCard";
import { useAppSelector } from "@/lib/store/hooks";
import { useDroppable } from "@dnd-kit/core";
import { Button } from "@heroui/react";

interface ColumnProps {
	type: ColumnType;
	openForm?: (card?: CardType) => void;
}

export default function Column({ type, openForm }: Readonly<ColumnProps>) {
	const cards = useAppSelector((state) =>
		Object.values(state.board.cards)
			.filter((card) => card.column === type)
			.sort((a, b) => a.order - b.order)
	);

	const { setNodeRef } = useDroppable({
		id: type,
	});

	let title;
	let classes;
	switch (type) {
		case "TODO":
			title = "To Do";
			classes = "bg-blue-500";
			break;
		case "IN_PROGRESS":
			title = "In Progress";
			classes = "bg-yellow-500";
			break;
		case "DONE":
			title = "Done";
			classes = "bg-green-500";
			break;
	}

	return (
		<div className="w-1/3">
			<h2 className="font-bold mb-4 text-lg">{title}</h2>
			<div
				className={`${classes} w-full h-full p-4 rounded-sm`}
				ref={setNodeRef}
			>
				<SortableContext
					items={cards.map((card) => card.id)}
					strategy={verticalListSortingStrategy}
				>
					{cards.map((card) => (
						<DraggeableCard
							key={card.id}
							card={card}
							openForm={openForm}
						/>
					))}
				</SortableContext>
				{cards.length > 0 && type === "TODO" && openForm && (
					<Button
						className="min-h-[80px] w-full bg-gray-700 text-gray-200 text-lg"
						onPress={() => openForm()}
					>
						Create new card
					</Button>
				)}
			</div>
		</div>
	);
}
