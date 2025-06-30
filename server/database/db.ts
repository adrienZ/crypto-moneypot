import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as schema from "./schemas";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// In-memory Postgres
const client = new PGlite({
	dataDir: path.resolve(__dirname, "../../.data"),
});
export const db = drizzle({ client, schema });
