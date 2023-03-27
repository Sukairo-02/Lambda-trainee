import * as Boom from '@hapi/boom'
import { eq, like, and } from 'drizzle-orm/expressions'
import { Router } from 'express'

import orm from '@Database/HospitalLocation'

import attachParsers from '@Util/attachParsers'

import s from './schema'

import type InfoControllerHandlers from './types'

const { City, Clinic, Suburb, NearbySuburb } = orm.tables
const { db } = orm

class InfoController {
	constructor(app: Router, path: string) {
		const router = Router()

		const { city, cityByState, citySlug, suburb, suburbByState, suburbSlug, nearbySuburbs, clinic, clinicSlug } =
			attachParsers(this.handlers, s)

		router.get('/city', city)
		router.get('/city/byState/:stateSlug', cityByState)
		router.get('/city/:citySlug', citySlug)
		router.get('/suburb', suburb)
		router.get('/suburb/:stateSlug', suburbByState)
		router.get('/suburb/:stateSlug/:suburbSlug', suburbSlug)
		router.get('/nearbySuburbs/:stateSlug/:suburbSlug', nearbySuburbs)
		router.get('/clinic', clinic)
		router.get('/clinic/:clinicSlug', clinicSlug)

		app.use(path, router)
	}

	private handlers: InfoControllerHandlers = {
		async city(req, res) {
			const { offset, limit } = req.query

			const cities = await db
				.select({ name: City.name, slug: City.slug, state: City.state })
				.from(City)
				.offset(offset)
				.limit(limit)

			return res.json({ cities })
		},

		async cityByState(req, res) {
			const { offset, limit } = req.query
			const { stateSlug } = req.params

			const cities = await db
				.select({ name: City.name, slug: City.slug, state: City.state })
				.from(City)
				.where(eq(City.state, stateSlug.toLowerCase()))
				.offset(offset)
				.limit(limit)

			return res.json({ cities })
		},

		async citySlug(req, res) {
			const { citySlug } = req.params

			const [city] = await db.select().from(City).where(eq(City.slug, citySlug))

			if (!city) throw Boom.notFound()
			return res.json({ city })
		},

		async suburb(req, res) {
			const { offset, limit } = req.query

			const suburbs = await db
				.select({ name: Suburb.name, slug: Suburb.slug, city: Suburb.citySlug })
				.from(Suburb)
				.offset(offset)
				.limit(limit)

			return res.json({ suburbs })
		},

		async suburbByState(req, res) {
			const { offset, limit } = req.query
			const { stateSlug } = req.params

			const suburbs = await db
				.select({ name: Suburb.name, slug: Suburb.slug, city: Suburb.citySlug })
				.from(Suburb)
				.where(like(Suburb.slug, `${stateSlug.toLowerCase()}/%`))
				.offset(offset)
				.limit(limit)

			return res.json({ suburbs })
		},

		async suburbSlug(req, res) {
			const { stateSlug, suburbSlug } = req.params
			const fullSlug = `${stateSlug.toLowerCase()}/${suburbSlug.toLowerCase()}`

			const [suburb] = await db.select().from(Suburb).where(eq(Suburb.slug, fullSlug))

			if (!suburb) throw Boom.notFound()
			return res.json({ suburb })
		},

		async nearbySuburbs(req, res) {
			const { offset, limit } = req.query
			const { stateSlug, suburbSlug } = req.params
			const fullSlug = `${stateSlug.toLowerCase()}/${suburbSlug.toLowerCase()}`

			const suburbs = await db
				.select({
					name: Suburb.name,
					slug: Suburb.slug,
					city: Suburb.citySlug
				})
				.from(NearbySuburb)
				.innerJoin(Suburb, eq(NearbySuburb.nearSuburb, Suburb.slug))
				.where(and(eq(NearbySuburb.suburb, fullSlug), eq(Suburb.slug, fullSlug)))
				.offset(offset)
				.limit(limit)

			return res.json({ suburbs })
		},

		async clinic(req, res) {
			const { offset, limit } = req.query

			const clinics = await db
				.select({
					slug: Clinic.slug,
					name: Clinic.name,
					longName: Clinic.longName,
					citySlug: Clinic.citySlug,
					suburbSlug: Clinic.suburbSlug,
					city: Clinic.cityName,
					suburb: Clinic.suburbName,
					pms: Clinic.pms
				})
				.from(Clinic)
				.offset(offset)
				.limit(limit)

			return res.json({ clinics })
		},

		async clinicSlug(req, res) {
			const { clinicSlug } = req.params

			const [clinic] = await db.select().from(Clinic).where(eq(Clinic.slug, clinicSlug))

			if (!clinic) throw Boom.notFound()
			return res.json({ clinic })
		}
	}
}

export = InfoController
