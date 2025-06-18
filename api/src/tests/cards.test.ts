import { api } from "./testApp";
let boardId: string;

describe("Cards actions", () => {
	beforeAll(async () => {
		const newBoard = {
			name: "Test Board for Cards",
		};

		const response = await api.post("/boards").send(newBoard).expect(201);
		boardId = response.body.id;

		expect(boardId).toBeDefined();
	});

	test("POST /cards - Create a new card", async () => {
		const newCard = {
			title: "Test Card",
			description: "This is a test card (order 1)",
			boardId,
		};

		const response = await api.post("/cards").send(newCard).expect(201);

		expect(response.body).toHaveProperty("id");
		expect(response.body.title).toBe(newCard.title);
		expect(response.body.description).toBe(newCard.description);
		expect(response.body.boardId).toBe(newCard.boardId);
		expect(response.body.column).toBe("TODO");
		expect(response.body.order).toBe(1);
	});

	test("GET /cards/board/:boardId - Retrieve cards by board ID", async () => {
		const response = await api.get(`/cards/board/${boardId}`).expect(200);

		expect(Array.isArray(response.body)).toBe(true);
		expect(response.body.length).toBeGreaterThan(0);
		expect(response.body[0]).toHaveProperty("id");
		expect(response.body[0]).toHaveProperty("title");
	});

	test("GET /cards/:id - Retrieve a card by ID", async () => {
		const newCard = {
			title: "Another Test Card",
			description: "This is another test card (order 2)",
			boardId,
		};

		const createResponse = await api
			.post("/cards")
			.send(newCard)
			.expect(201);

		const response = await api
			.get(`/cards/${createResponse.body.id}`)
			.expect(200);

		expect(response.body).toHaveProperty("id");
		expect(response.body).toHaveProperty("title");
	});

	test("PATCH /cards/:id - Update a card info (no ordering changes)", async () => {
		const newCard = {
			title: "Card to Update",
			description: "This card will be updated (order 3)",
			boardId,
		};

		const createResponse = await api
			.post("/cards")
			.send(newCard)
			.expect(201);
		const cardId = createResponse.body.id;

		const updatedCard = {
			title: "Updated Card Title",
			description: `Updated description (order ${createResponse.body.order})`,
		};

		const response = await api
			.patch(`/cards/${cardId}`)
			.send(updatedCard)
			.expect(200);

		expect(response.body.title).toBe(updatedCard.title);
		expect(response.body.description).toBe(updatedCard.description);
		expect(createResponse.body.column).toBe(response.body.column);
		expect(createResponse.body.order).toBe(response.body.order);
	});

	test("PATCH /cards/:id - Update a card order in same column", async () => {
		const newCard = {
			title: "Card to Reorder",
			description: "This card will be reordered (order 4)",
			boardId,
		};

		const createResponse = await api
			.post("/cards")
			.send(newCard)
			.expect(201);
		const cardId = createResponse.body.id;

		const newOrder = 2;

		const updatedCard = {
			order: newOrder,
		};

		const oldCardsReq = await api
			.get(`/cards/board/${boardId}`)
			.expect(200);

		const movedCards = oldCardsReq.body.filter(
			(card: { id: string; order: number }) =>
				card.order >= newOrder && card.id !== cardId
		);

		const response = await api
			.patch(`/cards/${cardId}`)
			.send(updatedCard)
			.expect(200);

		expect(response.body.order).toBe(updatedCard.order);
		expect(response.body.column).toBe(createResponse.body.column);
		expect(response.body.id).toBe(cardId);

		const newCardsReq = await api
			.get(`/cards/board/${boardId}`)
			.expect(200);
		const newCards = newCardsReq.body;
		expect(newCards.length).toBe(oldCardsReq.body.length);

		newCards.forEach((card: { id: string; order: number }) => {
			if (card.id === cardId) {
				expect(card.order).toBe(newOrder);
			} else {
				const movedCard = movedCards.find(
					(moved: { id: string }) => moved.id === card.id
				);

				if (movedCard) {
					expect(card.order).toBeGreaterThanOrEqual(newOrder);
				}
			}
		});
	});

	test("PATCH /cards/move/:id - Move a card order to an empty column", async () => {
		const newColumn = "IN_PROGRESS"; // The column wasn't populated before, so it is empty
		const newCard = {
			title: "Card to Move",
			description: `This card will be moved to ${newColumn} (order 1)`,
			boardId,
		};

		const createResponse = await api
			.post("/cards")
			.send(newCard)
			.expect(201);
		const cardId = createResponse.body.id;

		const updatedCard = {
			column: newColumn,
			order: 100, // Order in a previously empty column is not relevant, will be set to 1
		};

		const response = await api
			.patch(`/cards/move/${cardId}`)
			.send(updatedCard)
			.expect(200);

		expect(response.body.column).toBe(newColumn);
		expect(response.body.order).toBe(1);
		expect(response.body.id).toBe(cardId);
	});

	test("PATCH /cards/move/:id - Move a card order to a not empty column", async () => {
		const newColumn = "IN_PROGRESS"; // The column was populated in the previous test
		const newCard = {
			title: "Card to Move",
			description: `This card will be moved to ${newColumn} (order 2)`,
			boardId,
		};

		const createResponse = await api
			.post("/cards")
			.send(newCard)
			.expect(201);
		const cardId = createResponse.body.id;

		const updatedCard = {
			column: newColumn,
			order: 100, // Higher than the max order in the column will be set to max + 1 (=2)
		};
		const response = await api
			.patch(`/cards/move/${cardId}`)
			.send(updatedCard)
			.expect(200);

		expect(response.body.column).toBe(newColumn);
		expect(response.body.order).toBe(2);
		expect(response.body.id).toBe(cardId);
	});

	test("PATCH /cards/move/:id - Move a card order to a not empty column with specific order", async () => {
		const newColumn = "IN_PROGRESS"; // The column was populated in the previous tests
		const newCard = {
			title: "Card to Move",
			description: `This card will be moved to ${newColumn} (put before order 1)`,
			boardId,
		};

		const createResponse = await api
			.post("/cards")
			.send(newCard)
			.expect(201);
		const cardId = createResponse.body.id;

		const updatedCard = {
			column: newColumn,
			order: 1, // Specific order in the column
		};

		const response = await api
			.patch(`/cards/move/${cardId}`)
			.send(updatedCard)
			.expect(200);

		expect(response.body.column).toBe(newColumn);
		expect(response.body.order).toBe(1);
		expect(response.body.id).toBe(cardId);
	});

    test("DELETE /cards/:id - Delete a card", async () => {
        const newCard = {
            title: "Card to Delete",
            description: "This card will be deleted",
            boardId,
        };

        const createResponse = await api
            .post("/cards")
            .send(newCard)
            .expect(201);
        const cardId = createResponse.body.id;

        await api.delete(`/cards/${cardId}`).expect(204);

        await api.get(`/cards/${cardId}`).expect(404);
    });

    test("DELETE /cards/:id - Decrease orders of cards after the deletion", async () => {
        const column = "IN_PROGRESS"; // The column was populated in the previous tests

        const newCard = {
            title: "Card to Delete",
            description: "This card will be deleted (place in IN_PROGRESS, order 2)",
            boardId,
        };

        // Creating a new card, automatically placed in TODO
        const createResponse = await api
            .post("/cards")
            .send(newCard)
            .expect(201);
        const cardId = createResponse.body.id;

        // Reading cards IN_PROGRESS before the move request
        const cardsBeforeReq = await api
        .get(`/cards/board/${boardId}`)
        .expect(200);
        
        const cardsBefore = cardsBeforeReq.body.filter(
            (card: { id: string; order: number, column: string }) => card.id !== cardId && card.column === column
        );

        // Moving the card to IN_PROGRESS with order 2
        const newOrder = 2;
        const updatedCard = {
			column: column,
			order: newOrder
		};

		const response = await api
			.patch(`/cards/move/${cardId}`)
			.send(updatedCard)
			.expect(200);

        expect(response.body.column).toBe(column);
        expect(response.body.order).toBe(2);

        // Reading cards IN_PROGRESS after the move request
        const cardsAfterReq = await api
            .get(`/cards/board/${boardId}`)
            .expect(200);
        const cardsAfter = cardsAfterReq.body.filter(
            (card: { id: string; order: number, column: string }) => card.id !== cardId && card.column === column
        );
        
        // Checking that the order of cards after the move request is correct
        expect(cardsAfter.length).toBe(cardsBefore.length);
        cardsAfter.forEach((card: { id: string; order: number }, index: number) => {
            if (cardsBefore[index].order < newOrder) {
                expect(card.order).toBe(cardsBefore[index].order);
            }
            else {
                expect(card.order).toBe(cardsBefore[index].order + 1);
            }
        });


        await api.delete(`/cards/${cardId}`).expect(204);
        await api.get(`/cards/${cardId}`).expect(404);

        // Reading cards IN_PROGRESS after the delete request
        const cardsAfterDeleteReq = await api
            .get(`/cards/board/${boardId}`)
            .expect(200);
        const cardsAfterDelete = cardsAfterDeleteReq.body.filter(
            (card: { id: string; order: number, column: string }) => card.column === column
        );
        // Checking that the order of cards after the delete request is correct (no gaps in order)
        expect(cardsAfterDelete.length).toBe(cardsBefore.length);
        cardsAfterDelete.forEach((card: { id: string; order: number }, index: number) => {
            expect(card.order).toBe(cardsBefore[index].order);
        });
    });

    test("GET /cards/:id - Invalid UUID", async () => {
        const invalidId = "1234567890abcdef12345678"; // Example invalid ID
        await api.get(`/cards/${invalidId}`).expect(400);
    });

    test("GET /boards/:id - Board has Cards array attribute", async () => {
        await api.get(`/boards/${boardId}`).expect(200).then((response) => {
            expect(response.body).toHaveProperty("cards");
            expect(Array.isArray(response.body.cards)).toBe(true);
        });
    });

    test("GET /cards/:id - Card has Board object attribute", async () => {
        const newCard = {
            title: "Card with Board",
            description: "This card will have a Board object attribute",
            boardId,
        };

        const createResponse = await api
            .post("/cards")
            .send(newCard)
            .expect(201);
        const cardId = createResponse.body.id;

        await api.get(`/cards/${cardId}`).expect(200).then((response) => {
            expect(response.body).toHaveProperty("board");
            expect(response.body.board).toHaveProperty("id", boardId);
        });
    });
});
