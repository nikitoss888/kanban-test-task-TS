export interface Board {
	id: string;
	name: string;
}

export interface BoardAPI extends Board {
	cards?: CardType[];
}

export type ColumnType = "TODO" | "IN_PROGRESS" | "DONE";

export interface CardType {
	id: string;
	boardId: string;
	column: ColumnType;
	title: string;
	description?: string;
	order: number;
}

export type LoadingStatus = "idle" | "loading" | "error";

export type StoreState = {
	status: LoadingStatus;
	board: Board | null;
	cards: Record<string, CardType>;
	error: string | null;
};
