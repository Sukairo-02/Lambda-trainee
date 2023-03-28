import { ilike } from 'drizzle-orm/expressions'
import { Router } from 'express'

import orm from '@Database/Northwind'

import attachParsers from '@Util/attachParsers'

import s from './schema'
import SearchControllerHandlers from './types'

const { Customer, Product } = orm.tables
const { db } = orm

class SearchController {
	constructor(app: Router, path: string) {
		const router = Router()

		const { product, customer, emptyQuery } = attachParsers(this.handlers, s)

		router.get('/customers/:name', customer)
		router.get('/products/:name', product)
		router.get('/customers', emptyQuery)
		router.get('/products', emptyQuery)

		app.use(path, router)
	}

	private handlers: SearchControllerHandlers = {
		async product(req, res) {
			const { name } = req.params

			const query = db
				.select()
				.from(Product)
				.where(ilike(Product.name, `%${name}%`))
			const products = await query

			return res.json({ products, sequel: query.toSQL() })
		},

		async customer(req, res) {
			const { name } = req.params

			const query = db
				.select()
				.from(Customer)
				.where(ilike(Customer.companyName, `%${name}%`))
			const customers = await query

			return res.json({ customers, sequel: query.toSQL() })
		},

		async emptyQuery(req, res) {
			return res.json([])
		}
	}
}

export = SearchController
