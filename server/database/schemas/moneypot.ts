import { pgTable, serial, integer, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "./auth-schemas";
import { defaultDatesColumns } from "./schema-utils";

export const pots = pgTable("pots", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  creatorId: text("creator_id")
    .references(() => user.id)
    .notNull(),
  walletAddress: text("wallet_address").notNull(),
  walletPrivateKey: text("wallet_private_key").notNull(),
  ...defaultDatesColumns
});

export const contributions = pgTable("contributions", {
  id: serial("id").primaryKey(),
  potId: integer("pot_id")
    .references(() => pots.id)
    .notNull(),
  contributorId: text("contributor_id")
    .references(() => user.id)
    .notNull(),
  from: text("from").notNull(),
  to: text("to").notNull(),
  amount: text("amount").notNull(),
  txHash: text("tx_hash").notNull(),
  ...defaultDatesColumns
});
