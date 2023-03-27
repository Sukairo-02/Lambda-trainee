CREATE TABLE IF NOT EXISTS "city" (
	"slug" varchar PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"state" varchar NOT NULL,
	"meta_title" varchar,
	"meta_desc" varchar,
	"h1" varchar,
	"h2" varchar,
	"sub_heading" varchar,
	"tick_1" varchar,
	"tick_2" varchar,
	"tick_3" varchar,
	"about" varchar
);

CREATE TABLE IF NOT EXISTS "clinic" (
	"slug" varchar PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"long_name" varchar NOT NULL,
	"city_slug" varchar NOT NULL,
	"suburb_slug" varchar NOT NULL,
	"city_name" varchar NOT NULL,
	"suburb_name" varchar,
	"full_address" varchar NOT NULL,
	"pms" varchar NOT NULL,
	"meta_title" varchar,
	"meta_desc" varchar,
	"typeform" varchar,
	"website" varchar,
	"email" varchar,
	"phone" varchar,
	"about" varchar
);

CREATE TABLE IF NOT EXISTS "nearby_suburbs" (
	"suburb" varchar NOT NULL,
	"near_suburb" varchar NOT NULL
);

CREATE TABLE IF NOT EXISTS "suburb" (
	"slug" varchar PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"city_slug" varchar NOT NULL,
	"meta_title" varchar,
	"meta_desc" varchar,
	"h1" varchar,
	"h2" varchar,
	"about" varchar
);

DO $$ BEGIN
 ALTER TABLE clinic ADD CONSTRAINT clinic_suburb_slug_suburb_slug_fk FOREIGN KEY ("suburb_slug") REFERENCES suburb("slug") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE nearby_suburbs ADD CONSTRAINT nearby_suburbs_suburb_suburb_slug_fk FOREIGN KEY ("suburb") REFERENCES suburb("slug") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE nearby_suburbs ADD CONSTRAINT nearby_suburbs_near_suburb_suburb_slug_fk FOREIGN KEY ("near_suburb") REFERENCES suburb("slug") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE suburb ADD CONSTRAINT suburb_city_slug_city_slug_fk FOREIGN KEY ("city_slug") REFERENCES city("slug") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS name_unique_idx ON city ("name","state");
CREATE UNIQUE INDEX IF NOT EXISTS unique_nearby_idx ON nearby_suburbs ("suburb","near_suburb");