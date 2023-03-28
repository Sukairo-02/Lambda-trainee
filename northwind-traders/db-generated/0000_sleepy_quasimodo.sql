CREATE TABLE IF NOT EXISTS "category" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"description" varchar NOT NULL
);

CREATE TABLE IF NOT EXISTS "customer" (
	"id" varchar PRIMARY KEY NOT NULL,
	"company_name" varchar NOT NULL,
	"contact_name" varchar,
	"contact_title" varchar,
	"address" varchar,
	"city" varchar,
	"region" varchar,
	"postcode" varchar,
	"phone" varchar,
	"fax" varchar
);

CREATE TABLE IF NOT EXISTS "employee" (
	"id" serial PRIMARY KEY NOT NULL,
	"reports_to" integer NOT NULL,
	"last_name" varchar,
	"first_name" varchar NOT NULL,
	"title" varchar NOT NULL,
	"title_of_courtesy" varchar DEFAULT 'Mr.' NOT NULL,
	"birth_date" date NOT NULL,
	"hireDate" date NOT NULL,
	"address" varchar NOT NULL,
	"city" varchar NOT NULL,
	"region" varchar,
	"postcode" varchar,
	"country" varchar,
	"home_phone" varchar,
	"extension" varchar,
	"notes" varchar
);

CREATE TABLE IF NOT EXISTS "employee_territory" (
	"employee_id" integer NOT NULL,
	"territory_id" integer NOT NULL
);

CREATE TABLE IF NOT EXISTS "tradeorder" (
	"id" serial PRIMARY KEY NOT NULL,
	"customer_id" varchar NOT NULL,
	"employee_id" integer NOT NULL,
	"order_date" date DEFAULT now() NOT NULL,
	"required_date" date NOT NULL,
	"shipped_date" date,
	"shipper_id" integer NOT NULL,
	"freight" real NOT NULL,
	"ship_name" varchar NOT NULL,
	"ship_address" varchar NOT NULL,
	"ship_city" varchar NOT NULL,
	"ship_region" varchar,
	"ship_postcode" varchar,
	"ship_country" varchar
);

CREATE TABLE IF NOT EXISTS "order_details" (
	"orderId" integer NOT NULL,
	"product_id" integer NOT NULL,
	"unit_price" real NOT NULL,
	"quantity" integer DEFAULT 1 NOT NULL,
	"discount" real DEFAULT 0 NOT NULL
);

CREATE TABLE IF NOT EXISTS "product" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"supplier_id" integer NOT NULL,
	"category_id" integer NOT NULL,
	"quantity_per_unit" varchar NOT NULL,
	"unit_price" real NOT NULL,
	"in_stock" integer DEFAULT 0 NOT NULL,
	"in_order" integer DEFAULT 0 NOT NULL,
	"reorder_level" integer DEFAULT 0 NOT NULL,
	"discontinued" boolean DEFAULT false NOT NULL
);

CREATE TABLE IF NOT EXISTS "region" (
	"id" serial PRIMARY KEY NOT NULL,
	"description" varchar NOT NULL
);

CREATE TABLE IF NOT EXISTS "shipper" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"phone" varchar NOT NULL
);

CREATE TABLE IF NOT EXISTS "supplier" (
	"id" serial PRIMARY KEY NOT NULL,
	"company_name" varchar NOT NULL,
	"contact_name" varchar,
	"contact_title" varchar,
	"address" varchar NOT NULL,
	"city" varchar NOT NULL,
	"region" varchar,
	"postcode" varchar,
	"phone" varchar NOT NULL,
	"fax" varchar,
	"homepage" varchar
);

CREATE TABLE IF NOT EXISTS "territory" (
	"id" serial PRIMARY KEY NOT NULL,
	"description" varchar NOT NULL,
	"region_id" integer NOT NULL
);

DO $$ BEGIN
 ALTER TABLE employee ADD CONSTRAINT employee_reports_to_employee_id_fk FOREIGN KEY ("reports_to") REFERENCES employee("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE employee_territory ADD CONSTRAINT employee_territory_employee_id_employee_id_fk FOREIGN KEY ("employee_id") REFERENCES employee("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE employee_territory ADD CONSTRAINT employee_territory_territory_id_territory_id_fk FOREIGN KEY ("territory_id") REFERENCES territory("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE tradeorder ADD CONSTRAINT tradeorder_customer_id_customer_id_fk FOREIGN KEY ("customer_id") REFERENCES customer("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE tradeorder ADD CONSTRAINT tradeorder_employee_id_employee_id_fk FOREIGN KEY ("employee_id") REFERENCES employee("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE tradeorder ADD CONSTRAINT tradeorder_shipper_id_shipper_id_fk FOREIGN KEY ("shipper_id") REFERENCES shipper("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE order_details ADD CONSTRAINT order_details_orderId_tradeorder_id_fk FOREIGN KEY ("orderId") REFERENCES tradeorder("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE order_details ADD CONSTRAINT order_details_product_id_product_id_fk FOREIGN KEY ("product_id") REFERENCES product("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE product ADD CONSTRAINT product_supplier_id_supplier_id_fk FOREIGN KEY ("supplier_id") REFERENCES supplier("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE product ADD CONSTRAINT product_category_id_category_id_fk FOREIGN KEY ("category_id") REFERENCES category("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE territory ADD CONSTRAINT territory_region_id_region_id_fk FOREIGN KEY ("region_id") REFERENCES region("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
