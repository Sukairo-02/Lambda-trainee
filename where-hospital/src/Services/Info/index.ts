import { eq, like } from 'drizzle-orm/expressions'
import Orm from '@Database/HospitalLocation'

import type { RequestHandler } from 'express'

const { City, Clinic, Suburb, NearbySuburb } = Orm.Tables

class Info {
	public City = <RequestHandler>(async (req, res, next) => {
		try {
			const db = await Orm.Connector.connect()
			const cities = await db.select(City).fields({ name: City.name, slug: City.slug, state: City.state })
			return res.json({ cities })
		} catch (e) {
			next(e)
		}
	})

	public CityByState = <RequestHandler<{ stateSlug: string }>>(async (req, res, next) => {
		try {
			const db = await Orm.Connector.connect()
			const cities = await db
				.select(City)
				.fields({ name: City.name, slug: City.slug, state: City.state })
				.where(eq(City.state, req.params.stateSlug.toUpperCase()))
			return res.json({ cities })
		} catch (e) {
			next(e)
		}
	})

	public CitySlug = <RequestHandler<{ citySlug: string }>>(async (req, res, next) => {
		try {
			const db = await Orm.Connector.connect()
			const cities = await db.select(City).where(eq(City.slug, req.params.citySlug))
			return res.json({ city: cities[0] })
		} catch (e) {
			next(e)
		}
	})

	public Suburb = <RequestHandler>(async (req, res, next) => {
		try {
			const db = await Orm.Connector.connect()
			const suburbs = await db
				.select(Suburb)
				.fields({ name: Suburb.name, slug: Suburb.slug, city: Suburb.citySlug })
			return res.json({ suburbs })
		} catch (e) {
			next(e)
		}
	})

	public SuburbByState = <RequestHandler<{ stateSlug: string }>>(async (req, res, next) => {
		try {
			const db = await Orm.Connector.connect()
			const suburbs = await db
				.select(Suburb)
				.fields({ name: Suburb.name, slug: Suburb.slug, city: Suburb.citySlug })
				.where(like(Suburb.slug, `${req.params.stateSlug.toLowerCase()}/%`))
			return res.json({ suburbs })
		} catch (e) {
			next(e)
		}
	})

	public SuburbSlug = <RequestHandler<{ stateSlug: string; suburbSlug: string }>>(async (req, res, next) => {
		try {
			const db = await Orm.Connector.connect()
			const fullSlug = `${req.params.stateSlug.toLowerCase()}/${req.params.suburbSlug.toLowerCase()}`

			const suburbs = await db.select(Suburb).where(eq(Suburb.slug, fullSlug))
			return res.json({ suburb: suburbs[0] })
		} catch (e) {
			next(e)
		}
	})

	public NearbySuburbs = <RequestHandler<{ stateSlug: string; suburbSlug: string }>>(async (req, res, next) => {
		try {
			const db = await Orm.Connector.connect()
			const fullSlug = `${req.params.stateSlug.toLowerCase()}/${req.params.suburbSlug.toLowerCase()}`

			const suburbs = (
				await db
					.select(NearbySuburb)
					.innerJoin(Suburb, eq(NearbySuburb.nearSuburb, Suburb.slug))
					.where(eq(NearbySuburb.suburb, fullSlug))
			)
				.map((e) => ({ name: e.suburb.name, slug: e.suburb.slug, city: e.suburb.citySlug }))
				.filter((e) => e.slug !== fullSlug)
			return res.json({ suburbs })
		} catch (e) {
			next(e)
		}
	})

	public Clinic = <RequestHandler>(async (req, res, next) => {
		try {
			const db = await Orm.Connector.connect()
			const clinics = await db.select(Clinic).fields({
				slug: Clinic.slug,
				name: Clinic.name,
				longName: Clinic.longName,
				citySlug: Clinic.citySlug,
				suburbSlug: Clinic.suburbSlug,
				city: Clinic.cityName,
				suburb: Clinic.suburbName,
				pms: Clinic.pms
			})

			return res.json({ clinics })
		} catch (e) {
			next(e)
		}
	})

	public ClinicSlug = <RequestHandler<{ clinicSlug: string }>>(async (req, res, next) => {
		try {
			const db = await Orm.Connector.connect()
			const clinics = await db.select(Clinic).where(eq(Clinic.slug, req.params.clinicSlug))
			return res.json({ clinic: clinics[0] })
		} catch (e) {
			next(e)
		}
	})
}

export = new Info()
