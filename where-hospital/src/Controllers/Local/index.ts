import * as Boom from '@hapi/boom'
import { eq, like } from 'drizzle-orm/expressions'
import Orm from '@Database/HospitalLocation'

import type { RequestHandler } from 'express'

const { City, Clinic, Suburb, NearbySuburb } = Orm.Tables

class Local {
	public City = <RequestHandler<{ citySlug: string }>>(async (req, res, next) => {
		try {
			const db = await Orm.Connector.connect()
			const clinics = await db.select(Clinic).where(eq(Clinic.citySlug, req.params.citySlug))

			if (!clinics.length) throw Boom.notFound()
			return res.json({ clinics })
		} catch (e) {
			next(e)
		}
	})

	public Postcode = <RequestHandler<{ postcode: string }>>(async (req, res, next) => {
		try {
			const db = await Orm.Connector.connect()
			const clinics = await db.select(Clinic).where(like(Clinic.suburbSlug, `%-${req.params.postcode}`))

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

			const clinics = await db.select(Clinic).where(eq(Clinic.suburbSlug, fullSlug))

			if (!clinics.length) throw Boom.notFound()
			return res.json({ clinics })
		} catch (e) {
			next(e)
		}
	})
}

export = new Local()
