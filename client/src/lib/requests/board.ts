import { request } from "./common";

export const fetchCreateBoard = async (name: string) => {
	const response = await request("POST", `/boards`, JSON.stringify({ name }));
	console.log(response);

	if (!response.ok) throw await response.json();
	return await response.json();
};

export const fetchGetBoard = async (boardId: string) => {
	const response = await request("GET", `/boards/${boardId}`);

	if (!response.ok) throw await response.json();
	return response.json();
};
