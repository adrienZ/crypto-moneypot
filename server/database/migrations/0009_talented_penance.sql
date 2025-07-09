ALTER TABLE "contributions" ALTER COLUMN "updated_at" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "pot_category" ALTER COLUMN "updated_at" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "pots" ALTER COLUMN "updated_at" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "wallets" ALTER COLUMN "updated_at" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "contributions" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "pot_category" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "pots" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "wallets" ADD COLUMN "deleted_at" timestamp;