ALTER TABLE "pots" ADD COLUMN "target_amount" bigint;--> statement-breakpoint
ALTER TABLE "pots" ADD COLUMN "cover_image" text;--> statement-breakpoint
ALTER TABLE "pots" ADD COLUMN "description" text NOT NULL;