import { ilike } from 'drizzle-orm/expressions'
import Orm from '@Database/Northwind'
import { dbLogger } from '@Util/DbLogger'

import type { RequestHandler } from 'express'

const db = Orm.Connector

const { Customer, Product } = Orm.Tables

class Search {
	public Product = <RequestHandler<{ name: string }>>(async (req, res, next) => {
		try {
			const products = await dbLogger(
				req.headers.tabUUID as string,
				db.select(Product).where(ilike(Product.name, `%${req.params.name}%`))
			)

			return res.json(products)
		} catch (e) {
			next(e)
		}
	})

	public Customer = <RequestHandler<{ name: string }>>(async (req, res, next) => {
		try {
			const customers = await dbLogger(
				req.headers.tabUUID as string,
				db.select(Customer).where(ilike(Customer.companyName, `%${req.params.name}%`))
			)

			return res.json(customers)
		} catch (e) {
			next(e)
		}
	})

	public EmptyQuery = <RequestHandler<{ name: string }>>(async (req, res, next) => {
		return res.json([])
	})
}

export = new Search()
