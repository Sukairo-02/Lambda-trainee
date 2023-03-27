import { eq, like } from 'drizzle-orm/expressions'
import { Router } from 'express'

import orm from '@Database/HospitalLocation'
import attachParsers from '@Util/attachParsers'

import s from './schema'

import type LocalControllerHandlers from './types'

const { Clinic } = orm.tables
const { db } = orm

class LocalController {
	constructor(app: Router, path: string) {
		const router = Router()

		const { city, postcode, suburb } = attachParsers(this.handlers, s)

		router.get('/city/:citySlug', city)
		router.get('/postcode/:postcode', postcode)
		router.get('/suburb/:stateSlug/:suburbSlug', suburb)

		app.use(path, router)
	}

	private handlers: LocalControllerHandlers = {
		async city(req, res) {
			const { offset, limit } = req.query
			const { citySlug } = req.params

			const clinics = await db
				.select()
				.from(Clinic)
				.where(eq(Clinic.citySlug, citySlug))
				.offset(offset)
				.limit(limit)

			return res.json({ clinics })
		},

		async postcode(req, res) {
			const { offset, limit } = req.query
			const { postcode } = req.params

			const clinics = await db
				.select()
				.from(Clinic)
				.where(like(Clinic.suburbSlug, `%-${postcode}`))
				.offset(offset)
				.limit(limit)

			return res.json({ clinics })
		},

		async suburb(req, res) {
			const { offset, limit } = req.query
			const { stateSlug, suburbSlug } = req.params
			const fullSlug = `${stateSlug.toLowerCase()}/${suburbSlug.toLowerCase()}`

			const clinics = await db
				.select()
				.from(Clinic)
				.where(eq(Clinic.suburbSlug, fullSlug))
				.offset(offset)
				.limit(limit)

			return res.json({ clinics })
		}
	}
}

export = LocalController
