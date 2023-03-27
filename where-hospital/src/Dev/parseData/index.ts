import csv from 'csvtojson'
import orm from '@Database/HospitalLocation'

import type { Cities, Clinics, ReadCities, ReadClincs, ReadSuburbs, Suburbs, WithoutNullableKeys } from './types'

const { db } = orm
const { City, Clinic, Suburb, NearbySuburb } = orm.tables

//lib doesn't support relative paths, HAVE to use __dirname
const readCities: ReadCities = async () => {
	return (<unknown>csv().fromFile(`${__dirname}/../../../rawData/cities.csv`)) as Cities
}

const readClincs: ReadClincs = async () => {
	return (<unknown>csv().fromFile(`${__dirname}/../../../rawData/clinics.csv`)) as Clinics
}

const readSuburbs: ReadSuburbs = async () => {
	return (<unknown>csv().fromFile(`${__dirname}/../../../rawData/suburbs.csv`)) as Suburbs
}

const start = async () => {
	const [cities, clinics, suburbs] = await Promise.all([readCities(), readClincs(), readSuburbs()])

	const prepared = {
		cities: cities
			.map((e) => ({
				slug: e.city_slug?.split('/')[1],
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
				citySlug: cities
					.find((el) => el.city_name === e.City && el.state === e.State)
					?.city_slug?.split('/')[1], //replace city name with city slug
				suburbSlug: e['link to clinic suburb page'],
				cityName: e.City,
				suburbName: e.Suburb,
				fullAddress: e['Full Address'],
				pms: e.PMS,
				metaTitle: e['Meta-title'],
				metaDesc: e['Meta-description'],
				typeform: e['Typeform registration link'],
				website: e.Website,
				email: e.Email,
				phone: e.Phone,
				about: e['About Clinic']
			}))
			.filter(
				(e) =>
					e.slug &&
					e.name &&
					e.longName &&
					e.citySlug &&
					e.suburbSlug &&
					e.cityName &&
					e.suburbName &&
					e.fullAddress &&
					e.pms
			),
		suburbs: suburbs
			.map((e) => ({
				slug: e['suburb-slug'],
				name: e.suburb_name,
				citySlug: cities
					.find((el) => el.city_name === e.City && el.state === e.State)
					?.city_slug?.split('/')[1],
				metaTitle: e.meta_title,
				metaDesc: e.meta_description,
				h1: e.H1,
				h2: e.H2,
				about: e.about_bookphysio
			}))
			.filter((e) => e.slug && e.name && e.citySlug)
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

			nearbySuburbs.push({
				suburb: e[`nearby${i}_link`],
				nearSuburb: e['suburb-slug']
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

			nearbySuburbs.push({
				suburb: e[`nearby${i}_link`],
				nearSuburb: suburbSlug
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

	await orm.migrate(db, {
		migrationsFolder: './db-generated'
	})

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
