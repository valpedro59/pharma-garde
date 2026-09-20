CREATE TYPE "public"."type_garde" AS ENUM('JOUR_VOLET_OUVERT', 'NUIT_VOLET_FERME', 'GARDE_24H');--> statement-breakpoint
CREATE TABLE "arrondissements" (
	"id" serial PRIMARY KEY NOT NULL,
	"nom" varchar(100) NOT NULL,
	"ville_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "gardes" (
	"id" serial PRIMARY KEY NOT NULL,
	"pharmacie_id" integer NOT NULL,
	"date_debut" timestamp NOT NULL,
	"date_fin" timestamp NOT NULL,
	"type_garde" "type_garde" NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pharmacies" (
	"id" serial PRIMARY KEY NOT NULL,
	"nom" varchar(255) NOT NULL,
	"adresse_textuelle" text NOT NULL,
	"telephone_1" varchar(50) NOT NULL,
	"telephone_2" varchar(50),
	"google_maps_url" text,
	"iframe_url" text,
	"arrondissement_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "users_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255) NOT NULL,
	"age" integer NOT NULL,
	"email" varchar(255) NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "villes" (
	"id" serial PRIMARY KEY NOT NULL,
	"nom" varchar(100) NOT NULL,
	CONSTRAINT "villes_nom_unique" UNIQUE("nom")
);
--> statement-breakpoint
ALTER TABLE "arrondissements" ADD CONSTRAINT "arrondissements_ville_id_villes_id_fk" FOREIGN KEY ("ville_id") REFERENCES "public"."villes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gardes" ADD CONSTRAINT "gardes_pharmacie_id_pharmacies_id_fk" FOREIGN KEY ("pharmacie_id") REFERENCES "public"."pharmacies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pharmacies" ADD CONSTRAINT "pharmacies_arrondissement_id_arrondissements_id_fk" FOREIGN KEY ("arrondissement_id") REFERENCES "public"."arrondissements"("id") ON DELETE restrict ON UPDATE no action;