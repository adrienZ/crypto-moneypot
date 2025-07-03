import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "./auth-schemas";
import { defaultDatesColumns } from "./schema-utils";

export const wallets = pgTable("wallets", {
  id: serial("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id),
  address: text("address").notNull(),
  ...defaultDatesColumns
});
