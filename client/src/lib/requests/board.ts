import { request } from "./common";

export const createBoard = async (name: string) => {
	const response = await request("POST", `/boards`, JSON.stringify({ name }));
	console.log(response);

	return response.json();
};

export const getBoard = async (boardId: string) => {
	const response = await request("GET", `/boards/${boardId}`);

	return response.json();
};
