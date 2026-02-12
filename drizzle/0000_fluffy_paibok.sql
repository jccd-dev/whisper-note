CREATE TABLE "selected_persons" (
	"id" serial PRIMARY KEY NOT NULL,
	"nickname_name" text[] NOT NULL,
	"prompt_for_this_person" text NOT NULL,
	"ai_generated" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "temporary_messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sender_name" text NOT NULL,
	"recipient_name" text NOT NULL,
	"salutation" text DEFAULT 'For [Name]' NOT NULL,
	"message" text NOT NULL,
	"closing" text DEFAULT 'With love,' NOT NULL,
	"passphrase" text,
	"expires_at" timestamp,
	"created_at" timestamp DEFAULT now()
);
