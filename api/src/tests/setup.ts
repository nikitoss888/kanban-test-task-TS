import prisma from "../prisma.test";

beforeAll(async () => {
	await prisma.card.deleteMany();
	await prisma.board.deleteMany();
});

afterAll(async () => {
	await prisma.$disconnect();
});
