CREATE TABLE "pot_category" (
	"id" uuid PRIMARY KEY NOT NULL,
	"type" text NOT NULL,
	"slug" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "pots" ADD COLUMN "category_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "pots" ADD CONSTRAINT "pots_category_id_pot_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."pot_category"("id") ON DELETE no action ON UPDATE no action;

--> statement-breakpoint
INSERT INTO "pot_category" ("id", "type", "slug", "created_at", "updated_at")
VALUES ('3cce9cf5-5f16-4e6e-a944-4d50e7cf03b1', 'consumer', 'birthday', now(), now());
--> statement-breakpoint

INSERT INTO "pot_category" ("id", "type", "slug", "created_at", "updated_at")
VALUES ('7e20ea71-11f9-4b94-8892-5f469a3798fa', 'consumer', 'farewell-retirement', now(), now());
--> statement-breakpoint

INSERT INTO "pot_category" ("id", "type", "slug", "created_at", "updated_at")
VALUES ('4d6e9a22-51cb-4b2c-a6ef-4519e5bc8b2d', 'consumer', 'birth-baptism', now(), now());
--> statement-breakpoint

INSERT INTO "pot_category" ("id", "type", "slug", "created_at", "updated_at")
VALUES ('be7fb091-1f6c-42f5-9e49-729a0c53d6c1', 'consumer', 'wedding-pacs', now(), now());
--> statement-breakpoint

INSERT INTO "pot_category" ("id", "type", "slug", "created_at", "updated_at")
VALUES ('dde1b50c-48f6-4a85-bcb9-9bceda5fc892', 'consumer', 'thank-you', now(), now());
--> statement-breakpoint

INSERT INTO "pot_category" ("id", "type", "slug", "created_at", "updated_at")
VALUES ('f0da4014-1177-4b8e-89a1-9f7b9b1c687e', 'consumer', 'events', now(), now());
--> statement-breakpoint

INSERT INTO "pot_category" ("id", "type", "slug", "created_at", "updated_at")
VALUES ('eb7112a2-b6b0-4e51-b4ff-ece3060d6d89', 'consumer', 'group-expense', now(), now());
--> statement-breakpoint

INSERT INTO "pot_category" ("id", "type", "slug", "created_at", "updated_at")
VALUES ('1f7a70e4-23f8-4938-8040-f0b5720e8b48', 'charity', 'mutual-aid', now(), now());
--> statement-breakpoint

INSERT INTO "pot_category" ("id", "type", "slug", "created_at", "updated_at")
VALUES ('e6aeb4dc-0cc9-4370-9af4-83a02e0b36ab', 'charity', 'animals', now(), now());
--> statement-breakpoint

INSERT INTO "pot_category" ("id", "type", "slug", "created_at", "updated_at")
VALUES ('97b4e045-0657-48a5-8e9b-6fb3856a7bb9', 'charity', 'funerals', now(), now());
--> statement-breakpoint

INSERT INTO "pot_category" ("id", "type", "slug", "created_at", "updated_at")
VALUES ('6d6b3612-fc6b-4e96-bf91-82e918d5636c', 'charity', 'health', now(), now());
--> statement-breakpoint

INSERT INTO "pot_category" ("id", "type", "slug", "created_at", "updated_at")
VALUES ('2248b489-09f9-4e55-a917-0e1bcf4ff897', 'charity', 'environment', now(), now());
--> statement-breakpoint

INSERT INTO "pot_category" ("id", "type", "slug", "created_at", "updated_at")
VALUES ('ac1bb13d-6d03-44e7-bae4-8cb44d5531f2', 'charity', 'other-solidarity-project', now(), now());