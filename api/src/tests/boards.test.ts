import { api } from "./testApp";

describe("Boards actions", () => {
	test("POST /boards - Create a new board", async () => {
		const newBoard = {
			name: "Test Board",
		};

		const response = await api.post("/boards").send(newBoard).expect(201);

		expect(response.body).toHaveProperty("id");
		expect(response.body.name).toBe(newBoard.name);
	});

	test("GET /boards - Retrieve all boards", async () => {
		const response = await api.get("/boards").expect(200);

		expect(Array.isArray(response.body)).toBe(true);
		expect(response.body.length).toBeGreaterThan(0);
	});

	test("GET /boards/:id - Retrieve a single board", async () => {
		const newBoard = {
			name: "Another Test Board",
		};

		const createResponse = await api
			.post("/boards")
			.send(newBoard)
			.expect(201);
		const boardId = createResponse.body.id;

		const response = await api.get(`/boards/${boardId}`).expect(200);

		expect(response.body).toHaveProperty("id", boardId);
		expect(response.body).toHaveProperty("name");
	});

	test("DELETE /boards/:id - Delete a board", async () => {
		const newBoard = {
			name: "Board to Delete",
		};

		const createResponse = await api
			.post("/boards")
			.send(newBoard)
			.expect(201);
		const boardId = createResponse.body.id;

		await api.delete(`/boards/${boardId}`).expect(204);

		await api.get(`/boards/${boardId}`).expect(404);
	});

	test("GET /boards/:id - Invalid UUID", async () => {
		const invalidId = "1234567890abcdef12345678"; // Example invalid ID
		await api.get(`/boards/${invalidId}`).expect(400);
	});

	test("GET /boards/:id - Non-existent board", async () => {
		const nonExistentId = "00000000-0000-0000-0000-000000000000"; // Example non-existent ID
		await api.get(`/boards/${nonExistentId}`).expect(404);
	});
});
