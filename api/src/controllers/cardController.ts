import { Request, Response } from "express";
import prisma from "../prisma";
import { validateUUID } from "./boardController";
import { Card, Column } from "../../generated/prisma";

const isValidColumn = (column: string): column is Column => {
	return Object.values(Column).includes(column as Column);
};

const orderingCards = async (
	oldCard: Card,
	updCard: Card,
	destLastCard: Card | null
) => {
	if (oldCard.column === updCard.column && oldCard.order === updCard.order) {
		return;
	}

	const isNewLast = updCard.order > destLastCard?.order;

	await decreaseOrders(
		updCard.id,
		oldCard.boardId,
		oldCard.column,
		oldCard.order,
		oldCard.column === updCard.column ? updCard.order : undefined
	);

	if (!isNewLast) {
		await increaseOrders(
			updCard.id,
			updCard.boardId,
			updCard.column,
			updCard.order,
			oldCard.column === updCard.column ? oldCard.order : undefined
		);
	}
};

const decreaseOrders = async (
	id: string,
	boardId: string,
	column: Column,
	fromOrder: number,
	toOrder?: number
) => {
	await prisma.card.updateMany({
		where: {
			boardId: boardId,
			column: column,
			order: {
				gte: fromOrder,
				lte: toOrder,
			},
			id: {
				not: id,
			},
		},
		data: {
			order: {
				decrement: 1,
			},
		},
	});
};

const increaseOrders = async (
	id: string,
	boardId: string,
	column: Column,
	fromOrder: number,
	toOrder?: number
) => {
	await prisma.card.updateMany({
		where: {
			boardId: boardId,
			column: column,
			order: {
				gte: fromOrder,
				lte: toOrder,
			},
			id: {
				not: id,
			},
		},
		data: {
			order: {
				increment: 1,
			},
		},
	});
};

export const createCard = async (req: Request, res: Response) => {
	const { title, description, boardId } = req.body;

	if (!title || !boardId) {
		res.status(400).json({ error: "Title and boardId are required" });
		return;
	}

	if (typeof boardId !== "string" || !validateUUID(boardId)) {
		res.status(400).json({ error: "Invalid boardId format" });
		return;
	}

	if (typeof title !== "string" || typeof description !== "string") {
		res.status(400).json({ error: "Invalid title or description format" });
		return;
	}

	try {
		const board = await prisma.board.findUnique({
			where: { id: boardId },
		});

		if (!board) {
			res.status(404).json({ error: "Board not found" });
			return;
		}

		const lastCard = await prisma.card.findFirst({
			where: { boardId },
			orderBy: { order: "desc" },
		});

		try {
			const card = await prisma.card.create({
				data: {
					title,
					description,
					boardId,
					column: "TODO",
					order: lastCard ? lastCard.order + 1 : 1,
				},
			});

			res.status(201).json(card);
		} catch (error) {
			console.error("Error creating card:", error);
			res.status(500).json({
				error: "Failed to create card",
				details: error,
			});
		}
	} catch (error) {
		console.error("Error:", error);
		res.status(500).json({
			error: "Failed to create card",
			details: error,
		});
	}
};

export const getCardsByBoardId = async (req: Request, res: Response) => {
	const { boardId } = req.params;

	if (!boardId || typeof boardId !== "string" || !validateUUID(boardId)) {
		res.status(400).json({ error: "Invalid boardId format" });
		return;
	}

	try {
		const cards = await prisma.card.findMany({
			where: { boardId },
			orderBy: { order: "asc" },
		});

		if (cards.length === 0) {
			res.status(404).json({ error: "No cards found for this board" });
			return;
		}

		res.status(200).json(cards);
	} catch (error) {
		console.error("Error fetching cards:", error);
		res.status(500).json({
			error: "Failed to fetch cards",
			details: error,
		});
	}
};

export const getCardById = async (req: Request, res: Response) => {
	const { id } = req.params;

	if (!id || typeof id !== "string" || !validateUUID(id)) {
		res.status(400).json({
			error: "Invalid card ID, expected a valid UUID",
		});
		return;
	}

	try {
		const card = await prisma.card.findUnique({
			where: { id },
			include: {
				board: true,
			},
		});

		if (!card) {
			res.status(404).json({ error: "Card not found" });
			return;
		}

		res.status(200).json(card);
	} catch (error) {
		console.error("Error fetching card:", error);
		res.status(500).json({
			error: "Failed to fetch card",
			details: error,
		});
	}
};

export const updateCard = async (req: Request, res: Response) => {
	const { id } = req.params;
	const { title, description, column, order } = req.body;

	if (!id || typeof id !== "string" || !validateUUID(id)) {
		res.status(400).json({ error: "Invalid card ID format" });
		return;
	}

	if (order && (typeof order !== "number" || order < 0)) {
		res.status(400).json({ error: "Order must be a positive number" });
		return;
	}

	if (column && (typeof column !== "string" || !isValidColumn(column))) {
		res.status(400).json({ error: "Invalid column type" });
		return;
	}

	try {
		const oldCard = await prisma.card.findUnique({
			where: { id },
		});
		if (!oldCard) {
			res.status(404).json({ error: "Card not found" });
			return;
		}

		const destLastCard = await prisma.card.findFirst({
			where: { boardId: oldCard.boardId, column },
			orderBy: { order: "desc" },
		});

		let newOrder = order;
		if (!destLastCard) newOrder = 1;
		else if (order > destLastCard.order) newOrder = destLastCard.order + 1;

		const card = await prisma.card.update({
			where: { id },
			data: {
				title,
				description,
				column: (column as Column) && newOrder ? column : undefined,
				order: (column as Column) && newOrder ? newOrder : undefined,
			},
		});

		await orderingCards(oldCard, card, destLastCard);

		res.status(200).json(card);
	} catch (error) {
		console.error("Error updating card:", error);
		res.status(500).json({
			error: "Failed to update card",
			details: error,
		});
	}
};

export const moveCard = async (req: Request, res: Response) => {
	const { id } = req.params;
	const { column, order } = req.body;

	if (!id || typeof id !== "string" || !validateUUID(id)) {
		res.status(400).json({
			error: "Invalid card ID, expected a valid UUID",
		});
		return;
	}

	if (!column || typeof order !== "number") {
		res.status(400).json({
			error: "Both 'column' and 'order' are required",
		});
		return;
	}

	if (!isValidColumn(column)) {
		res.status(400).json({ error: "Invalid column type" });
		return;
	}

	if (typeof order !== "number" || order < 0) {
		res.status(400).json({ error: "Order must be a positive number" });
		return;
	}

	if (typeof column !== "string" || !isValidColumn(column)) {
		res.status(400).json({ error: "Invalid column type" });
		return;
	}

	try {
		const oldCard = await prisma.card.findUnique({
			where: { id },
		});

		if (!oldCard) {
			res.status(404).json({ error: "Card not found" });
			return;
		}

		const destLastCard = await prisma.card.findFirst({
			where: {
				boardId: oldCard.boardId,
				column: column,
			},
			orderBy: { order: "desc" },
		});

		let newOrder = order;
		if (!destLastCard) newOrder = 1;
		else if (order > destLastCard.order) newOrder = destLastCard.order + 1;

		const card = await prisma.card.update({
			where: { id },
			data: {
				column: column,
				order: newOrder,
			},
		});

		await orderingCards(oldCard, card, destLastCard);

		res.status(200).json(card);
	} catch (error) {
		console.error("Error moving card:", error);
		res.status(500).json({
			error: "Failed to move card",
			details: error,
		});
	}
};

export const deleteCard = async (req: Request, res: Response) => {
	const { id } = req.params;

	if (!id || typeof id !== "string" || !validateUUID(id)) {
		res.status(400).json({
			error: "Invalid card ID, expected a valid UUID",
		});
		return;
	}

	try {
		const card = await prisma.card.findUnique({
			where: { id },
		});

		if (!card) {
			res.status(404).json({ error: "Card not found" });
			return;
		}

		await prisma.card.delete({
			where: { id },
		});

		await decreaseOrders(id, card.boardId, card.column, card.order);

		res.status(204).send();
	} catch (error) {
		console.error("Error deleting card:", error);
		res.status(500).json({
			error: "Failed to delete card",
			details: error,
		});
	}
};
