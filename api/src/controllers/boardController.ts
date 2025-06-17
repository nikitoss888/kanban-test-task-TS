import { Request, Response } from "express";
import prisma from "../prisma";

const validateUUID = (id: string): boolean => {
	const uuidRegex =
		/^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
	return uuidRegex.test(id);
};

export const createBoard = async (req: Request, res: Response) => {
	const { id, name } = req.body;

	if (!name || typeof name !== "string") {
		res.status(400).json({ error: "Board name is required" });
		return;
	}

	// UUID validation
	const boardId = validateUUID(id) ? id : crypto.randomUUID();

	try {
		const newBoard = await prisma.board.create({
			data: {
				id: boardId,
				name: name,
			},
		});

		res.status(201).json(newBoard);
	} catch (error) {
		console.error("Error creating board:", error);
		res.status(500).json({
			error: "Failed to create board",
			details: error,
		});
	}
};

export const getBoards = async (req: Request, res: Response) => {
	try {
		const boards = await prisma.board.findMany();
		res.status(200).json(boards);
	} catch (error) {
		console.error("Error fetching boards:", error);
		res.status(500).json({
			error: "Failed to fetch boards",
			details: error,
		});
	}
};

export const getBoardById = async (req: Request, res: Response) => {
	const { id } = req.params;

	if (!id || !validateUUID(id)) {
		res.status(400).json({ error: "Invalid board ID" });
		return;
	}

	try {
		const board = await prisma.board.findUnique({
			where: { id: id },
		});

		if (!board) {
			res.status(404).json({ error: "Board not found" });
			return;
		}

		res.status(200).json(board);
	} catch (error) {
		console.error("Error fetching board:", error);
		res.status(500).json({
			error: "Failed to fetch board",
			details: error,
		});
	}
};

export const deleteBoard = async (req: Request, res: Response) => {
	const { id } = req.params;

	if (!id || !validateUUID(id)) {
		res.status(400).json({ error: "Invalid board ID" });
		return;
	}

	try {
		await prisma.board.delete({
			where: { id: id },
		});
		res.status(204).send();
	} catch (error) {
		console.error("Error deleting board:", error);
		res.status(500).json({
			error: "Failed to delete board",
			details: error,
		});
	}
};
