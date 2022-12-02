import * as Boom from '@hapi/boom'
import { eq, like, and } from 'drizzle-orm/expressions'
import Orm from '@Database/HospitalLocation'

import type { RequestHandler } from 'express'

const { City, Clinic, Suburb, NearbySuburb } = Orm.Tables

class Near {
	public City = <RequestHandler<{ citySlug: string }>>(async (req, res, next) => {
		try {
			const db = await Orm.Connector.connect()
			const clinics = (
				await db
					.select(City)
					.innerJoin(Suburb, and(eq(City.slug, Suburb.citySlug))!)
					.innerJoin(NearbySuburb, eq(Suburb.slug, NearbySuburb.suburb))
					.innerJoin(Clinic, eq(NearbySuburb.nearSuburb, Clinic.suburbSlug))
					.where(eq(City.slug, req.params.citySlug))
			).map((e) => e.clinic)

			if (!clinics.length) throw Boom.notFound()
			return res.json({ clinics })
		} catch (e) {
			next(e)
		}
	})

	public Postcode = <RequestHandler<{ postcode: string }>>(async (req, res, next) => {
		try {
			const db = await Orm.Connector.connect()
			const clinics = (
				await db
					.select(Suburb)
					.innerJoin(NearbySuburb, eq(Suburb.slug, NearbySuburb.suburb))
					.innerJoin(Clinic, eq(NearbySuburb.nearSuburb, Clinic.suburbSlug))
					.where(like(Suburb.slug, `%-${req.params.postcode}`))
			).map((e) => e.clinic)

			if (!clinics.length) throw Boom.notFound()
			return res.json({ clinics })
		} catch (e) {
			next(e)
		}
	})

	public Suburb = <RequestHandler<{ stateSlug: string; suburbSlug: string }>>(async (req, res, next) => {
		try {
			const db = await Orm.Connector.connect()
			const fullSlug = `${req.params.stateSlug.toLowerCase()}/${req.params.suburbSlug.toLowerCase()}`

			const clinics = (
				await db
					.select(Suburb)
					.innerJoin(NearbySuburb, eq(Suburb.slug, NearbySuburb.suburb))
					.innerJoin(Clinic, eq(NearbySuburb.nearSuburb, Clinic.suburbSlug))
					.where(eq(Suburb.slug, fullSlug))
			).map((e) => e.clinic)

			if (!clinics.length) throw Boom.notFound()
			return res.json({ clinics })
		} catch (e) {
			next(e)
		}
	})
}

export = new Near()
