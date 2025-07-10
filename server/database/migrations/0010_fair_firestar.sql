-- ALTER TABLE "contributions" ALTER COLUMN "amount" SET DATA TYPE numeric;
ALTER TABLE "contributions" ALTER COLUMN "amount" TYPE numeric USING amount::numeric--> statement-breakpoint
ALTER TABLE "pots" ALTER COLUMN "target_amount" SET DATA TYPE numeric;--> statement-breakpoint
ALTER TABLE "contributions" ADD CONSTRAINT "amount_must_be_positive" CHECK ("contributions"."amount" > 0);--> statement-breakpoint
ALTER TABLE "pots" ADD CONSTRAINT "target_amount_must_be_positive" CHECK ("pots"."target_amount" > 0);