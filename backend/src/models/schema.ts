import {
  pgTable,
  serial,
  varchar,
  text,
  integer,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm/relations";

// --- ENUMS ---
export const typeGardeEnum = pgEnum("type_garde", [
  "JOUR_VOLET_OUVERT",
  "NUIT_VOLET_FERME",
  "GARDE_24H",
]);

// --- 1. TABLE VILLES (Définie en premier car dépendue par d'autres) ---
export const villes = pgTable("villes", {
  id: serial("id").primaryKey(),
  nom: varchar("nom", { length: 100 }).notNull().unique(),
});

// --- 2. TABLE ARRONDISSEMENTS (Dépend de Villes) ---
export const arrondissements = pgTable("arrondissements", {
  id: serial("id").primaryKey(),
  nom: varchar("nom", { length: 100 }).notNull(),
  villeId: integer("ville_id")
    .notNull()
    .references(() => villes.id, { onDelete: "cascade" }),
});

// --- 3. TABLE PHARMACIES (Dépend des Arrondissements) ---
export const pharmacies = pgTable("pharmacies", {
  id: serial("id").primaryKey(),
  nom: varchar("nom", { length: 255 }).notNull(),
  adresseTextuelle: text("adresse_textuelle").notNull(),
  telephone1: varchar("telephone_1", { length: 50 }).notNull(),
  telephone2: varchar("telephone_2", { length: 50 }),
  googleMapsUrl: text("google_maps_url"),
  iframeUrl: text("iframe_url"),
  arrondissementId: integer("arrondissement_id")
    .notNull()
    .references(() => arrondissements.id, { onDelete: "restrict" }),
});

// --- 4. TABLE GARDES (Dépend des Pharmacies) ---
export const gardes = pgTable("gardes", {
  id: serial("id").primaryKey(),
  pharmacieId: integer("pharmacie_id")
    .notNull()
    .references(() => pharmacies.id, { onDelete: "cascade" }),
  dateDebut: timestamp("date_debut").notNull(),
  dateFin: timestamp("date_fin").notNull(),
  typeGarde: typeGardeEnum("type_garde").notNull(),
});

// --- 5. TABLE SIGNALEMENTS (US5 : signalement communautaire de fermeture) ---
export const signalements = pgTable("signalements", {
  id: serial("id").primaryKey(),
  pharmacieId: integer("pharmacie_id")
    .notNull()
    .references(() => pharmacies.id, { onDelete: "cascade" }),
  creeAt: timestamp("cree_at").notNull().defaultNow(),
});

// --- TABLE USERS (Indépendante, peut être n'importe où après la définition) ---
export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  age: integer().notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
});

// --- DÉFINITION DES RELATIONS ---

// 1. Relation Villes <-> Arrondissements

// VILLES
export const villesRelations = relations(villes, ({ many }) => ({
  arrondissements: many(arrondissements),
}));

// ARRONDISSEMENTS (
export const arrondissementsRelations = relations(
  arrondissements,
  ({ one, many }) => ({
    ville: one(villes, {
      fields: [arrondissements.villeId],
      references: [villes.id],
    }),
    pharmacies: many(pharmacies),
  }),
);

// PHARMACIES
export const pharmaciesRelations = relations(pharmacies, ({ one, many }) => ({
  arrondissement: one(arrondissements, {
    fields: [pharmacies.arrondissementId],
    references: [arrondissements.id],
  }),
  gardes: many(gardes),
  signalements: many(signalements),
}));

// GARDES
export const gardesRelations = relations(gardes, ({ one }) => ({
  pharmacie: one(pharmacies, {
    fields: [gardes.pharmacieId],
    references: [pharmacies.id],
  }),
}));

export const signalementsRelations = relations(signalements, ({ one }) => ({
  pharmacie: one(pharmacies, {
    fields: [signalements.pharmacieId],
    references: [pharmacies.id],
  }),
}));
