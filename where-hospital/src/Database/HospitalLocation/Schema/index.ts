import { pgTable, text, index, foreignKey } from 'drizzle-orm-pg'

//To-do: request un-broken .csv-s of suburbs and clinics
export const Suburb = pgTable('Suburb', {
	slug: text('slug').primaryKey().notNull(),
	name: text('name').notNull(),
	city: text('city'),
	state: text('state').notNull(),
	postcode: text('postcode'),
	metaTitle: text('meta_title'),
	metaDesc: text('meta_desc'),
	h1: text('h1'),
	h2: text('h2'),
	about: text('about')
})

export const City = pgTable(
	'City',
	{
		slug: text('slug').primaryKey().notNull(),
		name: text('name').notNull(),
		state: text('state').notNull(),
		metaTitle: text('meta_title'),
		metaDesc: text('meta_desc'),
		h1: text('h1'),
		h2: text('h2'),
		subHeading: text('sub_heading'),
		tickOne: text('tick_1'),
		tickTwo: text('tick_2'),
		tickThree: text('tick_3'),
		about: text('about')
	},
	(City) => ({
		nameUniqueIdx: index('name_unique_idx', City.name, { unique: true })
	})
)

//Every field is a slug
export const NearbySuburbs = pgTable(
	'Nearby_Suburbs',
	{
		suburb: text('suburb').notNull(),
		city: text('city').notNull(),
		nearCity: text('near_city').notNull(),
		nearSuburb: text('near_suburb').notNull()
	},
	(NearbySuburbs) => ({
		suburbFkey: foreignKey(() => ({
			columns: [NearbySuburbs.suburb],
			foreignColumns: [Suburb.slug]
		})),
		nearSuburbFkey: foreignKey(() => ({
			columns: [NearbySuburbs.nearSuburb],
			foreignColumns: [Clinic.suburbSlug]
		})),
		cityFkey: foreignKey(() => ({
			columns: [NearbySuburbs.city],
			foreignColumns: [City.slug]
		})),
		nearCityFkey: foreignKey(() => ({
			columns: [NearbySuburbs.nearCity],
			foreignColumns: [Clinic.citySlug]
		}))
	})
)

//Clinic's location's suburb and city names are to be replaced with slugs on csv-SQL migration
export const Clinic = pgTable('Clinic', {
	slug: text('slug').primaryKey().notNull(),
	name: text('name').notNull(),
	longName: text('long_name').notNull(),
	citySlug: text('city_name').notNull(),
	suburbSlug: text('suburb_slug').notNull(),
	postcode: text('postcode').notNull(),
	state: text('state').notNull(),
	fullAddress: text('full_address').notNull(),
	pms: text('pms').notNull(),
	metaTitle: text('meta_title'),
	metaDesc: text('meta_desc'),
	typeform: text('typeform'),
	website: text('website'),
	email: text('email').notNull(),
	phone: text('phone').notNull()
})
