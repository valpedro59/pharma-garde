CREATE TABLE "signalements" (
	"id" serial PRIMARY KEY NOT NULL,
	"pharmacie_id" integer NOT NULL,
	"cree_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "signalements" ADD CONSTRAINT "signalements_pharmacie_id_pharmacies_id_fk" FOREIGN KEY ("pharmacie_id") REFERENCES "public"."pharmacies"("id") ON DELETE cascade ON UPDATE no action;