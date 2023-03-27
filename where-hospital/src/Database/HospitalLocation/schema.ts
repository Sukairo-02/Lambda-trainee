import { pgTable, varchar, index, foreignKey, uniqueIndex } from 'drizzle-orm/pg-core'

//To-do: request un-broken .csv-s of suburbs and clinics
export const City = pgTable(
	'city',
	{
		slug: varchar('slug').primaryKey().notNull(),
		name: varchar('name').notNull(),
		state: varchar('state').notNull(),
		metaTitle: varchar('meta_title'),
		metaDesc: varchar('meta_desc'),
		h1: varchar('h1'),
		h2: varchar('h2'),
		subHeading: varchar('sub_heading'),
		tickOne: varchar('tick_1'),
		tickTwo: varchar('tick_2'),
		tickThree: varchar('tick_3'),
		about: varchar('about')
	},
	(City) => ({
		nameUniqueIdx: uniqueIndex('name_unique_idx').on(City.name, City.state) //City name may be repeated in different states
	})
)

export const Suburb = pgTable('suburb', {
	slug: varchar('slug').primaryKey().notNull(),
	name: varchar('name').notNull(),
	citySlug: varchar('city_slug')
		.notNull()
		.references(() => City.slug),
	metaTitle: varchar('meta_title'),
	metaDesc: varchar('meta_desc'),
	h1: varchar('h1'),
	h2: varchar('h2'),
	about: varchar('about')
})

//Every field is a slug
export const NearbySuburb = pgTable(
	'nearby_suburbs',
	{
		suburb: varchar('suburb')
			.notNull()
			.references(() => Suburb.slug),
		nearSuburb: varchar('near_suburb')
			.notNull()
			.references(() => Suburb.slug)
	},
	(NearbySuburb) => ({
		uniqueNearbyIdx: uniqueIndex('unique_nearby_idx').on(NearbySuburb.suburb, NearbySuburb.nearSuburb)
	})
)

//Clinic's location's suburb and city names are to be replaced with slugs on csv-SQL migration
export const Clinic = pgTable('clinic', {
	slug: varchar('slug').primaryKey().notNull(),
	name: varchar('name').notNull(),
	longName: varchar('long_name').notNull(),
	citySlug: varchar('city_slug').notNull(),
	suburbSlug: varchar('suburb_slug')
		.notNull()
		.references(() => Suburb.slug),
	cityName: varchar('city_name').notNull(), //another 2 instances of duplicate data - optimization purpose
	suburbName: varchar('suburb_name'),
	fullAddress: varchar('full_address').notNull(),
	pms: varchar('pms').notNull(),
	metaTitle: varchar('meta_title'),
	metaDesc: varchar('meta_desc'),
	typeform: varchar('typeform'),
	website: varchar('website'),
	email: varchar('email'),
	phone: varchar('phone'),
	about: varchar('about')
})
