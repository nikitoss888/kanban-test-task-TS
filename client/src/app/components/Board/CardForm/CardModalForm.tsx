"use client";

import { CardType } from "@/lib/types";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { editCard, createCard } from "@/lib/store/slices/boardSlice";
import { useEffect, useState } from "react";
import {
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Button,
} from "@heroui/react";
import Inputs from "./Inputs";

interface FormProps {
	isOpen?: boolean;
	setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
	card?: CardType;
	setCard: React.Dispatch<React.SetStateAction<CardType | undefined>>;
}

export default function CardModalForm({
	isOpen,
	setIsOpen,
	card,
	setCard,
}: Readonly<FormProps>) {
	const [title, setTitle] = useState<string>("");
	const [description, setDescription] = useState<string>("");

	useEffect(() => {
		setTitle(card?.title ?? "");
		setDescription(card?.description ?? "");
	}, [card]);

	const boardId = useAppSelector((state) => state.board.board?.id);

	console.log({ card, title, description, boardId });

	const dispatch = useAppDispatch();

	const handleSubmit = () => {
		if (!boardId || title.length === 0) return;

		if (card) {
			dispatch(editCard({ id: card.id, title, description }));
		} else {
			dispatch(createCard({ boardId, title, description }));
		}

		handleClose();
	};

	const handleClose = () => {
		setIsOpen(false);
		setTitle("");
		setDescription("");
		setCard(undefined);
	};

	let modalTitle;
	if (boardId) modalTitle = card ? `Edit card ${card.id}` : "Create new card";
	else modalTitle = "No board available";

	return (
		<Modal isOpen={isOpen}>
			<ModalContent className="bg-black">
				<ModalHeader>{modalTitle}</ModalHeader>
				<ModalBody>
					{boardId ? (
						<Inputs
							title={title}
							setTitle={setTitle}
							description={description}
							setDescription={setDescription}
						/>
					) : (
						<p>
							No board is loaded, please load the relevant data to
							proceed.
						</p>
					)}
				</ModalBody>
				<ModalFooter>
					<Button color="primary" onPress={handleSubmit}>
						Submit
					</Button>
					<Button color="danger" onPress={handleClose}>
						Cancel
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}
