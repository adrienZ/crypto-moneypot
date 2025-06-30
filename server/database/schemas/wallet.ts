import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "./auth-schemas";

export const wallets = pgTable("wallets", {
  id: serial("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id),
  address: text("address").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
