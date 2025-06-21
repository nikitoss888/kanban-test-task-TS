import { request } from "./common";

export const fetchCreateCard = async (
	boardId: string,
	title: string,
	description?: string
) => {
	const response = await request(
		"POST",
		"/cards",
		JSON.stringify({
			boardId,
			title,
			description,
		})
	);
	console.log(response);

	return response.json();
};

export const fetchEditCard = async (
	id: string,
	title?: string,
	description?: string
) => {
	const response = await request(
		"PATCH",
		`/cards/${id}`,
		JSON.stringify({
			title,
			description,
		})
	);
	console.log(response);

	return response.json();
};

export const fetchMoveCard = async (
	id: string,
	column: string,
	order: number
) => {
	const response = await request(
		"PATCH",
		`/cards/move/${id}`,
		JSON.stringify({
			column,
			order,
		})
	);
	console.log(response);

	return response.json();
};

export const fetchDeleteCard = async (id: string) => {
	const response = await request("DELETE", `/cards/${id}`);
	console.log(response);

	return id;
};
