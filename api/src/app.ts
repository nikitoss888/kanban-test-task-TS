import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import boardRouter from "./routes/boardRoutes";
import cardRouter from "./routes/cardRoutes";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
	res.status(200).json({ "message": "Hello World!" })
});

app.use("/boards", boardRouter);
app.use("/cards", cardRouter);

export default app;
