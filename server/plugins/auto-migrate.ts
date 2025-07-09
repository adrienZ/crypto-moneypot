import { migrate } from "drizzle-orm/postgres-js/migrator";
import { resolve } from "path";
import { fileURLToPath } from "url";
import { defineNitroPlugin, runTask } from "nitropack/runtime";
import { db } from "../database/db";

export default defineNitroPlugin(async () => {
  if (import.meta.dev) {
    await migrate(db, {
      migrationsFolder: resolve(
        fileURLToPath(import.meta.url),
        "../../../",
        "./server/database/migrations",
      ),
    });
    try {
      await db.query.pots.findFirst();
    } catch {
      runTask("db:seed");
    }
  }
});
