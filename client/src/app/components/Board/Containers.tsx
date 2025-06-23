import {
	closestCorners,
	DndContext,
	PointerSensor,
	useSensor,
	useSensors,
	DragEndEvent,
	DragOverlay,
	DragStartEvent,
} from "@dnd-kit/core";
import { moveCard } from "@/lib/store/slices/boardSlice";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import Column from "./Column";
import { useState } from "react";
import CardItem from "./CardItem";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import { CardType, ColumnType, isOfColumnType } from "@/lib/types";

export default function Containers({
	openForm,
}: Readonly<{ openForm: (card?: CardType) => void }>) {
	const [activeCardId, setActiveCardId] = useState<string | null>(null);

	const dispatch = useAppDispatch();
	const { cards } = useAppSelector((state) => state.board);

	const sensors = useSensors(useSensor(PointerSensor));

	const handleDragStart = (event: DragStartEvent) => {
		setActiveCardId(event.active.id as string);
	};

	const handleDragEnd = (event: DragEndEvent) => {
		setActiveCardId(null);
		const { active, over } = event;

		if (!over) return;

		const sourceCard = cards[active.id];
		const overId = over.id as string;

		let newColumn: ColumnType;
		let newOrder: number;

		if (overId && isOfColumnType(overId)) {
			newColumn = overId;

			const columnCards = Object.values(cards)
				.filter((c) => c.column === newColumn)
				.sort((a, b) => a.order - b.order);

			newOrder = columnCards.length
				? columnCards[columnCards.length - 1].order + 1
				: 1;
		} else {
			const targetCard = cards[overId];
			newColumn = targetCard.column;
			newOrder = targetCard.order;
		}

		if (sourceCard.column === newColumn && sourceCard.order === newOrder) {
			return;
		}

		console.log(active, over);

		console.log({
			id: sourceCard.id,
			title: sourceCard.title,
			columnFrom: sourceCard.column,
			orderFrom: sourceCard.order,
			columnTo: newColumn,
			orderTo: newOrder,
		});

		dispatch(
			moveCard({ id: sourceCard.id, column: newColumn, order: newOrder })
		);
	};

	return (
		<DndContext
			sensors={sensors}
			collisionDetection={closestCorners}
			onDragStart={handleDragStart}
			onDragEnd={handleDragEnd}
		>
			<div className="flex w-full gap-4">
				<Column type="TODO" openForm={openForm} />
				<Column type="IN_PROGRESS" openForm={openForm} />
				<Column type="DONE" openForm={openForm} />
			</div>

			<DragOverlay
				modifiers={[restrictToWindowEdges]}
				dropAnimation={null}
			>
				{activeCardId ? (
					<CardItem card={cards[activeCardId]} isDragged />
				) : null}
			</DragOverlay>
		</DndContext>
	);
}
