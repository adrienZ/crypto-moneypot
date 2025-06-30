import { pgTable, serial, integer, text, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  githubId: text("github_id").notNull().unique(),
  walletAddress: text("wallet_address"),
});

export const pots = pgTable("pots", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  creatorId: integer("creator_id").references(() => users.id).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const contributions = pgTable("contributions", {
  id: serial("id").primaryKey(),
  potId: integer("pot_id").references(() => pots.id).notNull(),
  contributorId: integer("contributor_id").references(() => users.id).notNull(),
  amount: text("amount").notNull(),
  txHash: text("tx_hash").notNull(),
});
