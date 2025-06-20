export type Board = {
	id: string;
	name: string;
	cards?: Card[];
};

export type Card = {
	boardId: string;
	column: string;
	title: string;
	description?: string;
	order: number;
};

export type CardEntities = {
	[id: string]: Card;
};

export type StoreState = {
	status: "idle" | "loading" | "error";
	board: Board | null;
	cards: CardEntities | null;
	error: string | null;
};
