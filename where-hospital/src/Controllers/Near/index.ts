import { eq, like } from 'drizzle-orm/expressions'
import { Router } from 'express'

import orm from '@Database/HospitalLocation'
import attachParsers from '@Util/attachParsers'

import s from './schema'

import type NearControllerHandlers from './types'

const { City, Clinic, Suburb, NearbySuburb } = orm.tables
const { db } = orm

class NearController {
	constructor(app: Router, path: string) {
		const router = Router()

		const { city, postcode, suburb } = attachParsers(this.handlers, s)

		router.get('/city/:citySlug', city)
		router.get('/postcode/:postcode', postcode)
		router.get('/suburb/:stateSlug/:suburbSlug', suburb)

		app.use(path, router)
	}

	private handlers: NearControllerHandlers = {
		async city(req, res) {
			const { offset, limit } = req.query
			const { citySlug } = req.params

			const clinics = await db
				.select({ ...Clinic })
				.from(City)
				.innerJoin(Suburb, eq(City.slug, Suburb.citySlug))
				.innerJoin(NearbySuburb, eq(Suburb.slug, NearbySuburb.suburb))
				.innerJoin(Clinic, eq(NearbySuburb.nearSuburb, Clinic.suburbSlug))
				.where(eq(City.slug, citySlug))
				.offset(offset)
				.limit(limit)

			return res.json({ clinics })
		},

		async postcode(req, res) {
			const { offset, limit } = req.query
			const { postcode } = req.params

			const clinics = await db
				.select({ ...Clinic })
				.from(Suburb)
				.innerJoin(NearbySuburb, eq(Suburb.slug, NearbySuburb.suburb))
				.innerJoin(Clinic, eq(NearbySuburb.nearSuburb, Clinic.suburbSlug))
				.where(like(Suburb.slug, `%-${postcode}`))
				.offset(offset)
				.limit(limit)

			return res.json({ clinics })
		},

		async suburb(req, res) {
			const { offset, limit } = req.query
			const { stateSlug, suburbSlug } = req.params
			const fullSlug = `${stateSlug.toLowerCase()}/${suburbSlug.toLowerCase()}`

			const clinics = await db
				.select({ ...Clinic })
				.from(Suburb)
				.innerJoin(NearbySuburb, eq(Suburb.slug, NearbySuburb.suburb))
				.innerJoin(Clinic, eq(NearbySuburb.nearSuburb, Clinic.suburbSlug))
				.where(eq(Suburb.slug, fullSlug))
				.offset(offset)
				.limit(limit)

			return res.json({ clinics })
		}
	}
}

export = NearController
