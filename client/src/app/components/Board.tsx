"use client";

import { useState } from "react";
import CardModalForm from "./Board/CardForm/CardModalForm";
import Containers from "./Board/Containers";
import Form from "./Board/Form";
import { useAppSelector } from "@/lib/store/hooks";
import { CardType } from "@/lib/types";

export default function Board() {
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const [editCard, setEditCard] = useState<CardType | undefined>(undefined);

	const board = useAppSelector((state) => state.board.board);

	const openForm = (card?: CardType) => {
		setEditCard(card);
		setIsOpen(true);
	};

	return (
		<>
			<h1 className="text-[32px] sm:text-[48px] font-bold">
				Kanban Board
			</h1>
			<Form />
			{board && (
				<div className="w-1/2">
					<h2 className="text-[24px] sm:text-[32px] font-bold">
						{board.name}
					</h2>
					<p>ID: {board.id}</p>
				</div>
			)}
			<Containers openForm={openForm} />
			<CardModalForm
				isOpen={isOpen}
				setIsOpen={setIsOpen}
				card={editCard}
				setCard={setEditCard}
			/>
		</>
	);
}
