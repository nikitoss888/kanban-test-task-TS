import express from "express";
import {
	createCard,
	getCardsByBoardId,
	getCardById,
	updateCard,
	moveCard,
	deleteCard,
} from "../controllers/cardController";

const cardRouter = express.Router();

cardRouter.post("/", createCard);
cardRouter.get("/board/:boardId", getCardsByBoardId);
cardRouter.get("/:id", getCardById);
cardRouter.patch("/:id", updateCard);
cardRouter.patch("/move/:id/", moveCard);
cardRouter.delete("/:id", deleteCard);

export default cardRouter;
