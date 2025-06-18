import { execSync } from "child_process";
import dotenv from "dotenv";

dotenv.config({ path: ".env.test" });

if (!process.env.DATABASE_URL?.includes("test")) {
	console.error("Not a test DB! Aborting.");
	process.exit(1);
}

execSync("npx prisma db push --force-reset", { stdio: "inherit" });
