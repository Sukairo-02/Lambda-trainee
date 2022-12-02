import csv from 'csvtojson'
import orm from '@Database/HospitalLocation'

type WithoutNullableKeys<Type> = {
	[Key in keyof Type]-?: WithoutNullableKeys<NonNullable<Type[Key]>>
}

//lib doesn't support relative paths, HAVE to use __dirname
const readCities = async () => {
	return (<unknown>csv().fromFile(`${__dirname}/../rawData/cities.csv`)) as Promise<
		Partial<{
			city_slug: string
			city_name: string
			state: string
			meta_title: string
			meta_description: string
			H1: string
			H2: string
			sub_heading_text: string
			tick_1: string
			tick_2: string
			tick_3: string
			about_bookphysio: string
		}>[]
	>
}

const readClincs = async () => {
	return (<unknown>csv().fromFile(`${__dirname}/../rawData/clinics.csv`)) as Promise<
		Partial<{
			'Long Name Version': string
			'Typeform registration link': string
			PMS: string
			'Meta-title': string
			'Meta-description': string
			slug: string
			Website: string
			'Clinic Name': string
			Display_on_web: string //convert to boolean?
			'link to clinic suburb page': string
			'Full Address': string
			City: string
			Suburb: string
			State: string
			Postcode: string
			Email: string
			Phone: string
			nearby1_txt: string
			nearby1_link: string
			nearby2_txt: string
			nearby2_link: string
			nearby3_txt: string
			nearby3_link: string
			nearby4_txt: string
			nearby4_link: string
			'About Clinic': string
		}>[]
	>
}

const readSuburbs = async () => {
	return (<unknown>csv().fromFile(`${__dirname}/../rawData/suburbs.csv`)) as Promise<
		Partial<{
			field1: string
			'suburb-slug': string
			suburb_name: string
			City: string
			State: string
			Postcode: string
			meta_title: string
			meta_description: string
			H1: string
			H2: string
			about_bookphysio: string
			nearby1_txt: string
			nearby1_link: string
			nearby1_state: string
			nearby1_postcode: string
			nearby2_txt: string
			nearby2_link: string
			nearby2_state: string
			nearby2_postcode: string
			nearby3_txt: string
			nearby3_link: string
			nearby3_state: string
			nearby3_postcode: string
			nearby4_txt: string
			nearby4_link: string
			nearby4_state: string
			nearby4_postcode: string
		}>[]
	>
}

const start = async () => {
	const db = await orm.Connector.connect()
	const [cities, clinics, suburbs] = await Promise.all([readCities(), readClincs(), readSuburbs()])
	console.log(clinics)

	const prepared = {
		cities: cities
			.map((e) => ({
				slug: e.city_slug,
				name: e.city_name,
				state: e.state?.toLowerCase(),
				metaTitle: e.meta_title,
				metaDesc: e.meta_description,
				h1: e.H1,
				h2: e.H2,
				subHeading: e.sub_heading_text,
				tickOne: e.tick_1,
				tickTwo: e.tick_2,
				tickThree: e.tick_3,
				about: e.about_bookphysio
			}))
			.filter((e) => e.slug && e.name && e.state),
		clinics: clinics
			.map((e) => ({
				slug: e.slug?.split('/clinic/')[1] || e.slug?.split('/clinic/')[0], //cut off unnecessary part of slug
				name: e['Clinic Name'],
				longName: e['Long Name Version'],
				citySlug: cities.find((el) => el.city_name === e.City && el.state === e.State)?.city_slug, //replace city name with city slug
				suburbSlug: e['link to clinic suburb page'],
				postcode: e.Postcode,
				state: e.State?.toLowerCase(),
				cityName: e.City,
				suburbName: e.Suburb,
				fullAddress: e['Full Address'],
				pms: e.PMS,
				metaTitle: e['Meta-title'],
				metaDesc: e['Meta-description'],
				typeform: e['Typeform registration link'],
				website: e.Website,
				email: e.Email,
				phone: e.Phone
			}))
			.filter(
				(e) =>
					e.slug &&
					e.name &&
					e.longName &&
					e.citySlug &&
					e.suburbSlug &&
					e.postcode &&
					e.state &&
					e.cityName &&
					e.suburbName &&
					e.fullAddress &&
					e.pms
			),
		suburbs: suburbs
			.map((e) => ({
				slug: e['suburb-slug'],
				name: e.suburb_name,
				citySlug: cities.find((el) => el.city_name === e.City && el.state === e.State)?.city_slug,
				postcode: e.Postcode,
				metaTitle: e.meta_title,
				metaDesc: e.meta_description,
				h1: e.H1,
				h2: e.H2,
				about: e.about_bookphysio
			}))
			.filter((e) => e.slug && e.name && e.citySlug && e.postcode)
	}

	const nearbySuburbs: { suburb: string; nearSuburb: string }[] = []

	for (const e of suburbs) {
		if (!e['suburb-slug']) continue
		nearbySuburbs.push({
			suburb: e['suburb-slug'],
			nearSuburb: e['suburb-slug']
		})

		for (let i = 1; i <= 4; i++) {
			if (!e[`nearby${i}_link`]) continue

			nearbySuburbs.push({
				suburb: e['suburb-slug'],
				nearSuburb: e[`nearby${i}_link`]
			})
		}
	}

	for (const e of clinics) {
		const suburbSlug = suburbs.find(
			(el) => el.suburb_name === e.Suburb && el.State === e.State && el.Postcode === e.Postcode
		)?.['suburb-slug']

		if (!suburbSlug) continue
		nearbySuburbs.push({
			suburb: suburbSlug,
			nearSuburb: suburbSlug
		})

		for (let i = 1; i <= 4; i++) {
			if (!e[`nearby${i}_link`]) continue

			nearbySuburbs.push({
				suburb: suburbSlug,
				nearSuburb: e[`nearby${i}_link`]
			})
		}
	}

	const fullPrepared = {
		cities: prepared.cities.reduce((p, e) => {
			if (!p.find((el) => el.slug === e.slug || (el.name === e.name && el.state === e.state)))
				p.push(e as WithoutNullableKeys<typeof e>)
			return p
		}, [] as WithoutNullableKeys<typeof prepared.cities>),
		suburbs: prepared.suburbs.reduce((p, e) => {
			if (!p.find((el) => el.slug === e.slug)) p.push(e as WithoutNullableKeys<typeof e>)
			return p
		}, [] as WithoutNullableKeys<typeof prepared.suburbs>),
		clinics: prepared.clinics
			.reduce((p, e) => {
				if (!p.find((el) => el.slug === e.slug)) p.push(e as WithoutNullableKeys<typeof e>)
				return p
			}, [] as WithoutNullableKeys<typeof prepared.clinics>)
			.filter((e) => prepared.suburbs.find((el) => e.suburbSlug === el.slug)),
		nearbySuburbs: nearbySuburbs
			.reduce((p, e) => {
				if (!p.find((el) => el.suburb === e.suburb && el.nearSuburb === e.nearSuburb)) p.push(e)
				return p
			}, [] as typeof nearbySuburbs)
			.filter(
				(e) =>
					prepared.suburbs.find((el) => e.nearSuburb === el.slug) &&
					prepared.suburbs.find((el) => e.suburb === el.slug)
			)
	}

	const { City, Clinic, Suburb, NearbySuburb } = orm.Tables

	await db.delete(Clinic)
	await db.delete(NearbySuburb)
	await db.delete(Suburb)
	await db.delete(City)

	await db.insert(City).values(...fullPrepared.cities)
	await db.insert(Suburb).values(...fullPrepared.suburbs)
	await db.insert(Clinic).values(...fullPrepared.clinics)
	await db.insert(NearbySuburb).values(...fullPrepared.nearbySuburbs)
}

start()
