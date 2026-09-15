-- Table: public.arrondissements

-- DROP TABLE IF EXISTS public.arrondissements;

CREATE TABLE IF NOT EXISTS public.arrondissements
(
id serial NOT NULL,
ville_id integer,
nom character varying(100) COLLATE pg_catalog."default" NOT NULL,
numero_arrondissement integer,
CONSTRAINT arrondissements_pkey PRIMARY KEY (id),
CONSTRAINT arrondissements_ville_id_fkey FOREIGN KEY (ville_id)
REFERENCES public.villes (id) MATCH SIMPLE
ON UPDATE NO ACTION
ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.arrondissements
OWNER to postgres;

    -- Table: public.gardes

-- DROP TABLE IF EXISTS public.gardes;

CREATE TABLE IF NOT EXISTS public.gardes
(
id serial NOT NULL,
pharmacie_id integer,
date_debut timestamp without time zone NOT NULL,
date_fin timestamp without time zone NOT NULL,
type_garde character varying(20) COLLATE pg_catalog."default" NOT NULL,
CONSTRAINT gardes_pkey PRIMARY KEY (id),
CONSTRAINT gardes_pharmacie_id_fkey FOREIGN KEY (pharmacie_id)
REFERENCES public.pharmacies (id) MATCH SIMPLE
ON UPDATE NO ACTION
ON DELETE CASCADE,
CONSTRAINT chk_dates CHECK (date_fin > date_debut),
CONSTRAINT gardes_type_garde_check CHECK (type_garde::text = ANY (ARRAY['VOLET_OUVERT'::character varying, 'VOLET_FERME'::character varying]::text[]))
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.gardes
OWNER to postgres;
-- Index: idx_gardes_dates

-- DROP INDEX IF EXISTS public.idx_gardes_dates;

CREATE INDEX IF NOT EXISTS idx_gardes_dates
ON public.gardes USING btree
(date_debut ASC NULLS LAST, date_fin ASC NULLS LAST)
TABLESPACE pg_default;

-- Table: public.pharmacies

-- DROP TABLE IF EXISTS public.pharmacies;

CREATE TABLE IF NOT EXISTS public.pharmacies
(
id serial NOT NULL,
nom character varying(150) COLLATE pg_catalog."default" NOT NULL,
quartier_id integer,
telephone_1 character varying(20) COLLATE pg_catalog."default" NOT NULL,
telephone_2 character varying(20) COLLATE pg_catalog."default",
adresse_textuelle text COLLATE pg_catalog."default" NOT NULL,
coordonnees geometry(Point,4326),
cree_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
CONSTRAINT pharmacies_pkey PRIMARY KEY (id),
CONSTRAINT pharmacies_quartier_id_fkey FOREIGN KEY (quartier_id)
REFERENCES public.quartiers (id) MATCH SIMPLE
ON UPDATE NO ACTION
ON DELETE SET NULL
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.pharmacies
OWNER to postgres;
-- Index: idx_pharmacies_coords

-- DROP INDEX IF EXISTS public.idx_pharmacies_coords;

CREATE INDEX IF NOT EXISTS idx_pharmacies_coords
ON public.pharmacies USING gist
(coordonnees)
TABLESPACE pg_default;
-- Index: idx_pharmacies_quartier

-- DROP INDEX IF EXISTS public.idx_pharmacies_quartier;

CREATE INDEX IF NOT EXISTS idx_pharmacies_quartier
ON public.pharmacies USING btree
(quartier_id ASC NULLS LAST)
TABLESPACE pg_default;

    -- Table: public.quartiers

-- DROP TABLE IF EXISTS public.quartiers;

CREATE TABLE IF NOT EXISTS public.quartiers
(
id serial NOT NULL,
arrondissement_id integer,
nom character varying(100) COLLATE pg_catalog."default" NOT NULL,
CONSTRAINT quartiers_pkey PRIMARY KEY (id),
CONSTRAINT quartiers_arrondissement_id_fkey FOREIGN KEY (arrondissement_id)
REFERENCES public.arrondissements (id) MATCH SIMPLE
ON UPDATE NO ACTION
ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.quartiers
OWNER to postgres;

    -- Table: public.villes

-- DROP TABLE IF EXISTS public.villes;

CREATE TABLE IF NOT EXISTS public.villes
(
id serial NOT NULL,
nom character varying(100) COLLATE pg_catalog."default" NOT NULL,
CONSTRAINT villes_pkey PRIMARY KEY (id),
CONSTRAINT villes_nom_key UNIQUE (nom)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.villes
OWNER to postgres;

    -- Table: public.spatial_ref_sys

-- DROP TABLE IF EXISTS public.spatial_ref_sys;

CREATE TABLE IF NOT EXISTS public.spatial_ref_sys
(
srid integer NOT NULL,
auth_name character varying(256) COLLATE pg_catalog."default",
auth_srid integer,
srtext character varying(2048) COLLATE pg_catalog."default",
proj4text character varying(2048) COLLATE pg_catalog."default",
CONSTRAINT spatial_ref_sys_pkey PRIMARY KEY (srid),
CONSTRAINT spatial_ref_sys_srid_check CHECK (srid > 0 AND srid <= 998999)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.spatial_ref_sys
OWNER to postgres;

REVOKE ALL ON TABLE public.spatial_ref_sys FROM PUBLIC;

GRANT SELECT ON TABLE public.spatial_ref_sys TO PUBLIC;

GRANT ALL ON TABLE public.spatial_ref_sys TO postgres;
