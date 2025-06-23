import { CardType } from "@/lib/types";
import {
	Card,
	CardHeader,
	CardBody,
	CardFooter,
	Divider,
	Button,
} from "@heroui/react";
import { Edit, Trash } from "lucide-react";
import { useAppDispatch } from "@/lib/store/hooks";
import { deleteCard } from "@/lib/store/slices/boardSlice";

interface CardProps {
	card: CardType;
	openForm?: (card?: CardType) => void;
	isDragged?: boolean;
}

export default function CardItem({
	card,
	openForm,
	isDragged,
}: Readonly<CardProps>) {
	const dispatch = useAppDispatch();

	const handleEdit = () => {
		openForm?.(card);
	};

	const handleDelete = () => {
		dispatch(deleteCard(card.id));
	};

	return (
		<Card
			className={`bg-gray-900 shadow rounded mb-2 py-1 px-2 ${isDragged ? "border-4 border-white" : ""}`}
		>
			<CardHeader className="font-medium">{card.title}</CardHeader>
			<Divider className="bg-white" />
			<CardBody className="text-sm text-gray-400">
				{card.description}
			</CardBody>
			<CardFooter className="flex justify-end gap-3">
				<Button
					isIconOnly
					color="primary"
					aria-label="Edit"
					size="sm"
					onPress={handleEdit}
				>
					<Edit size={18} />
				</Button>
				<Button
					isIconOnly
					color="danger"
					aria-label="Delete"
					size="sm"
					onPress={handleDelete}
				>
					<Trash size={18} />
				</Button>
			</CardFooter>
		</Card>
	);
}
