import express from "express";
import {
	createBoard,
	getBoards,
	getBoardById,
	deleteBoard,
} from "../controllers/boardController";

const boardRouter = express.Router();

boardRouter.post("/", createBoard);
boardRouter.get("/", getBoards);
boardRouter.get("/:id", getBoardById);
boardRouter.delete("/:id", deleteBoard);

export default boardRouter;
