import { ilike } from 'drizzle-orm/expressions'
import Orm from '@Database/Northwind'
import type { RequestHandler } from 'express'

const db = Orm.Connector

const { Customer, Product } = Orm.Tables

class Search {
	public Product = <RequestHandler<{ name: string }>>(async (req, res, next) => {
		try {
			const query = db.select(Product).where(ilike(Product.name, `%${req.params.name}%`))
			const products = await query

			return res.json({ products, sequel: query.toSQL() })
		} catch (e) {
			next(e)
		}
	})

	public Customer = <RequestHandler<{ name: string }>>(async (req, res, next) => {
		try {
			const query = db.select(Customer).where(ilike(Customer.companyName, `%${req.params.name}%`))
			const customers = await query

			return res.json({ customers, sequel: query.toSQL() })
		} catch (e) {
			next(e)
		}
	})

	public EmptyQuery = <RequestHandler<{ name: string }>>(async (req, res, next) => {
		return res.json([])
	})
}

export = new Search()
