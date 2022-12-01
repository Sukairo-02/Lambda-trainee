import { pgTable, text, index, foreignKey } from 'drizzle-orm-pg'

//To-do: request un-broken .csv-s of suburbs and clinics
export const City = pgTable(
	'city',
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
		nameUniqueIdx: index('name_unique_idx', [City.name, City.state], { unique: true }) //City name may be repeated in different states
	})
)

export const Suburb = pgTable(
	'suburb',
	{
		slug: text('slug').primaryKey().notNull(),
		name: text('name').notNull(),
		citySlug: text('city_slug').notNull(),
		postcode: text('postcode').notNull(),
		metaTitle: text('meta_title'),
		metaDesc: text('meta_desc'),
		h1: text('h1'),
		h2: text('h2'),
		about: text('about')
	},
	(Suburb) => ({
		suburbFkey: foreignKey(() => ({
			columns: [Suburb.citySlug],
			foreignColumns: [City.slug]
		}))
	})
)

//Every field is a slug
export const NearbySuburb = pgTable(
	'nearby_suburbs',
	{
		suburb: text('suburb').notNull(),
		nearSuburb: text('near_suburb').notNull()
	},
	(NearbySuburb) => ({
		nearbySuburbFkey: foreignKey(() => ({
			columns: [NearbySuburb.suburb],
			foreignColumns: [Suburb.slug]
		})),

		nearbyNearSuburbFkey: foreignKey(() => ({
			columns: [NearbySuburb.nearSuburb],
			foreignColumns: [Suburb.slug]
		})),

		uniqueNearbyIdx: index('unique_nearby_idx', [NearbySuburb.suburb, NearbySuburb.nearSuburb])
	})
)

//Clinic's location's suburb and city names are to be replaced with slugs on csv-SQL migration
export const Clinic = pgTable(
	'clinic',
	{
		slug: text('slug').primaryKey().notNull(),
		name: text('name').notNull(),
		longName: text('long_name').notNull(),
		citySlug: text('city_name').notNull(),
		suburbSlug: text('suburb_slug').notNull(),
		postcode: text('postcode').notNull(),
		state: text('state').notNull(), //duplicate data - leftover for precise location query optimistaion - allows to bypass triple join statement for /local/
		fullAddress: text('full_address').notNull(),
		pms: text('pms').notNull(),
		metaTitle: text('meta_title'),
		metaDesc: text('meta_desc'),
		typeform: text('typeform'),
		website: text('website'),
		email: text('email').notNull(),
		phone: text('phone').notNull()
	},
	(Clinic) => ({
		clinicFkey: foreignKey(() => ({
			columns: [Clinic.suburbSlug],
			foreignColumns: [Suburb.slug]
		}))
	})
)
