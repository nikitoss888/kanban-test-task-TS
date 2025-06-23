import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { StoreState, CardType } from "@/lib/types";
import { fetchGetBoard, fetchCreateBoard } from "@/lib/requests/board";
import {
	fetchCreateCard,
	fetchDeleteCard,
	fetchEditCard,
	fetchMoveCard,
} from "@/lib/requests/cards";

const initialState: StoreState = {
	status: "idle",
	board: null,
	cards: {},
	error: null,
};

export const createBoard = createAsyncThunk(
	"kanban/createBoard",
	async (boardId: string, { rejectWithValue }) => {
		try {
			return await fetchCreateBoard(boardId);
		} catch (err: unknown) {
			const message = "Failed to create the board";
			if (typeof err === "object" && err !== null && "error" in err) {
				return rejectWithValue(
					(err as { error?: string }).error ?? message
				);
			}
			return rejectWithValue(message);
		}
	}
);

export const fetchBoard = createAsyncThunk(
	"kanban/fetchBoard",
	async (boardId: string, { rejectWithValue }) => {
		try {
			return await fetchGetBoard(boardId);
		} catch (err: unknown) {
			const message = "Failed to fetch the board";
			if (typeof err === "object" && err !== null && "error" in err) {
				return rejectWithValue(
					(err as { error?: string }).error ?? message
				);
			}
			return rejectWithValue(message);
		}
	}
);

export const createCard = createAsyncThunk(
	"kanban/createCard",
	async (
		data: { boardId: string; title: string; description: string },
		{ rejectWithValue }
	) => {
		try {
			return await fetchCreateCard(
				data.boardId,
				data.title,
				data.description
			);
		} catch (err: unknown) {
			const message = "Failed to create the card";
			if (typeof err === "object" && err !== null && "error" in err) {
				return rejectWithValue(
					(err as { error?: string }).error ?? message
				);
			}
			return rejectWithValue(message);
		}
	}
);

export const editCard = createAsyncThunk(
	"kanban/editCard",
	async (
		data: { id: string; title: string; description: string },
		{ rejectWithValue }
	) => {
		try {
			return await fetchEditCard(data.id, data.title, data.description);
		} catch (err: unknown) {
			const message = "Failed to edit the card";
			if (typeof err === "object" && err !== null && "error" in err) {
				return rejectWithValue(
					(err as { error?: string }).error ?? message
				);
			}
			return rejectWithValue(message);
		}
	}
);

export const moveCard = createAsyncThunk(
	"kanban/moveCard",
	async (
		data: { id: string; column: string; order: number },
		{ rejectWithValue }
	) => {
		try {
			return await fetchMoveCard(data.id, data.column, data.order);
		} catch (err: unknown) {
			const message = "Failed to move the card";
			if (typeof err === "object" && err !== null && "error" in err) {
				return rejectWithValue(
					(err as { error?: string }).error ?? message
				);
			}
			return rejectWithValue(message);
		}
	}
);

export const deleteCard = createAsyncThunk(
	"kanbak/deleteCard",
	async (id: string, { rejectWithValue }) => {
		try {
			return await fetchDeleteCard(id);
		} catch (err: unknown) {
			const message = "Failed to delete the card";
			if (typeof err === "object" && err !== null && "error" in err) {
				return rejectWithValue(
					(err as { error?: string }).error ?? message
				);
			}
			return rejectWithValue(message);
		}
	}
);

const boardSlice = createSlice({
	name: "board",
	initialState,
	reducers: {
		clearError: (state) => {
			state.status = "idle";
			state.error = null;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(createBoard.pending, (state, action) => {
				console.log("createBoard.pending", action);
				state.status = "loading";
				state.error = null;
			})
			.addCase(createBoard.fulfilled, (state, action) => {
				console.log("createBoard.fullfilled", action);
				state.status = "idle";
				state.error = null;

				const { id, name } = action.payload;
				state.board = {
					id,
					name,
				};
				state.cards = {};
			})
			.addCase(createBoard.rejected, (state, action) => {
				state.status = "error";
				state.error =
					(action.payload as string) ?? "Failed to create the board";
			})

			.addCase(fetchBoard.pending, (state) => {
				state.status = "loading";
				state.error = null;
			})
			.addCase(fetchBoard.fulfilled, (state, action) => {
				state.status = "idle";
				state.error = null;
				const { id, name, cards } = action.payload;
				state.board = {
					id,
					name,
				};
				state.cards = Object.fromEntries(
					cards.map((card: CardType) => [card.id, card])
				);
			})
			.addCase(fetchBoard.rejected, (state, action) => {
				state.status = "error";
				state.error =
					(action.payload as string) ?? "Failed to fetch the board";
			})

			.addCase(createCard.pending, (state) => {
				state.status = "loading";
				state.error = null;
			})
			.addCase(createCard.fulfilled, (state, action) => {
				state.status = "idle";
				state.error = null;
				const card: CardType = action.payload;

				state.cards ??= Object.fromEntries([[card.id, card]]);

				state.cards[card.id] = card;
			})
			.addCase(createCard.rejected, (state, action) => {
				state.status = "error";
				state.error =
					(action.payload as string) ?? "Failed to create card";
			})

			.addCase(editCard.pending, (state) => {
				state.status = "loading";
				state.error = null;
			})
			.addCase(editCard.fulfilled, (state, action) => {
				state.status = "idle";
				state.error = null;

				const card: CardType = action.payload;
				state.cards ??= Object.fromEntries([[card.id, card]]);
				state.cards[card.id] = card;
			})
			.addCase(editCard.rejected, (state, action) => {
				state.status = "error";
				state.error =
					(action.payload as string) ?? "Failed to edit card";
			})

			.addCase(moveCard.fulfilled, (state, action) => {
				state.status = "idle";
				state.error = null;

				const movedCard: CardType = action.payload;
				console.log("movedCard", movedCard);
				const oldCard = state.cards[movedCard.id];
				console.log("oldCard", oldCard);

				const sameColumn = oldCard.column === movedCard.column;
				console.log({ sameColumn });

				state.cards ??= Object.fromEntries([[movedCard.id, movedCard]]);
				const destColumnCards = Object.values(state.cards).filter(
					(card) => card.column === movedCard.column
				);
				console.log("destColumnCards", destColumnCards);

				let maxOrder = 0;
				if (destColumnCards.length > 0) {
					maxOrder = Math.max(
						...destColumnCards.map((card) => card.order)
					);
				}
				console.log({ maxOrder });

				const from = oldCard.order;
				const to = Math.min(
					movedCard.order,
					maxOrder + (sameColumn ? 0 : 1)
				);
				console.log({ from, to });

				state.cards[movedCard.id] = {
					...movedCard,
					order: to,
				};
				console.log(state.cards[movedCard.id]);

				Object.values(state.cards).forEach((card) => {
					if (card.id === movedCard.id) return;

					// Same column reorder
					if (sameColumn && card.column === movedCard.column) {
						// Moved down: shift cards between old and new down by 1
						if (
							from < to &&
							card.order > from &&
							card.order <= to
						) {
							card.order -= 1;
						}
						// Moved up: shift cards between new and old up by 1
						else if (
							from > to &&
							card.order >= to &&
							card.order < from
						) {
							card.order += 1;
						}
					}
					// 📍 Different columns
					else {
						// Decrement cards after original position in source column
						if (
							card.column === oldCard.column &&
							card.order > from
						) {
							card.order -= 1;
						}

						// Increment cards at or after new position in target column
						if (
							card.column === movedCard.column &&
							card.order >= to
						) {
							card.order += 1;
						}
					}
				});
			})
			.addCase(moveCard.rejected, (state, action) => {
				state.status = "error";
				state.error =
					(action.payload as string) ?? "Failed to move card";
			})

			.addCase(deleteCard.pending, (state) => {
				state.status = "loading";
				state.error = null;
			})
			.addCase(deleteCard.fulfilled, (state, action) => {
				state.status = "idle";
				state.error = null;

				delete state.cards[action.payload];
			})
			.addCase(deleteCard.rejected, (state, action) => {
				state.status = "error";
				state.error =
					(action.payload as string) ?? "Failed to delete card";
			});
	},
});

export default boardSlice.reducer;
export const { clearError } = boardSlice.actions;
