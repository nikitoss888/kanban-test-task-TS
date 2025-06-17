import express from "express";
import {
	createBoard,
	getBoards,
	getBoardById,
	deleteBoard,
} from "../controllers/boardController";

const router = express.Router();

router.post("/", createBoard);
router.get("/", getBoards);
router.get("/:id", getBoardById);
router.delete("/:id", deleteBoard);

export default router;
