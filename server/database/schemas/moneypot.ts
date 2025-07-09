import { pgTable, serial, integer, text, bigint, uuid } from "drizzle-orm/pg-core";
import { user } from "./auth-schemas";
import { defaultDatesColumns } from "./schema-utils";

const type = [ "consumer", "charity"] as const
export const potCategory = pgTable("pot_category", {
  id: uuid("id").primaryKey(),
  type: text("type", { enum: type }).notNull(),
  slug: text("slug").notNull(),
  ...defaultDatesColumns
});

export const pots = pgTable("pots", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  creatorId: text("creator_id")
    .references(() => user.id)
    .notNull(),
  categoryId: uuid("category_id")
    .references(() => potCategory.id)
    .notNull(),
  targetAmount: bigint("target_amount", { mode: "bigint" }),
  coverImage: text("cover_image").notNull(),
  description: text("description").notNull(),
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
