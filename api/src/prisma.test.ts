import { PrismaClient } from "../generated/prisma/client";

if (!process.env.DATABASE_URL?.includes("test")) {
	throw new Error(
		`Refusing to connect: Not a test database! (DATABASE_URL: ${process.env.DATABASE_URL})`
	);
}

const prisma = new PrismaClient({
	log: ["warn", "error"],
});

export default prisma;
