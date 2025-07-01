import { pgTable, serial, integer, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "./auth-schemas";

// export const users = pgTable("users", {
//   id: serial("id").primaryKey(),
//   email: text("email").notNull().unique(),
//   githubId: text("github_id").notNull().unique(),
//   walletAddress: text("wallet_address"),
// });

export const pots = pgTable("pots", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  creatorId: text("creator_id")
    .references(() => user.id)
    .notNull(),
  walletAddress: text("wallet_address").notNull(),
  walletPrivateKey: text("wallet_private_key").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const contributions = pgTable("contributions", {
  id: serial("id").primaryKey(),
  potId: integer("pot_id")
    .references(() => pots.id)
    .notNull(),
  contributorId: text("contributor_id")
    .references(() => user.id)
    .notNull(),
  amount: text("amount").notNull(),
  txHash: text("tx_hash").notNull(),
});
