import * as Boom from '@hapi/boom'
import { Router } from 'express'
import { eq } from 'drizzle-orm/expressions'
import { alias } from 'drizzle-orm/pg-core'

import orm from '@Database/Northwind'

import attachParsers from '@Util/attachParsers'

import s from './schema'

import type GetDataControllerHandlers from './types'

const {
	Category,
	Customer,
	Employee,
	EmployeeTerritory,
	OrderDetails,
	Order,
	Product,
	Region,
	Shipper,
	Supplier,
	Territory
} = orm.tables
const { db } = orm

const ReportsTo = alias(Employee, 'reportsTo')

class GetDataController {
	constructor(app: Router, path: string) {
		const router = Router()

		const { customers, customer, employees, employee, suppliers, supplier, products, product, orders, order } =
			attachParsers(this.handlers, s)

		router.get('/customers', customers)
		router.get('/customer/:id', customer)
		router.get('/employees', employees)
		router.get('/employee/:id', employee)
		router.get('/suppliers', suppliers)
		router.get('/supplier/:id', supplier)
		router.get('/products', products)
		router.get('/product/:id', product)
		router.get('/orders', orders)
		router.get('/order/:id', order)

		app.use(path, router)
	}

	private handlers: GetDataControllerHandlers = {
		async customers(req, res) {
			const { offset, limit } = req.query

			const query = db.select().from(Customer).offset(offset).limit(limit)

			const customers = await query

			return res.json({ customers, sequel: query.toSQL() })
		},

		async customer(req, res) {
			const { id } = req.params

			const query = db.select().from(Customer).where(eq(Customer.id, id))

			const [customer] = await query
			if (!customer) throw Boom.notFound()

			return res.json({ customer, sequel: query.toSQL() })
		},

		async employees(req, res) {
			const { offset, limit } = req.query

			const query = db.select().from(Employee).offset(offset).limit(limit)

			const employees = await query

			return res.json({ employees, sequel: query.toSQL() })
		},

		async employee(req, res) {
			const { id } = req.params

			const query = db
				.select()
				.from(Employee)
				.innerJoin(EmployeeTerritory, eq(Employee.id, EmployeeTerritory.employeeId))
				.innerJoin(Territory, eq(EmployeeTerritory.territoryId, Territory.id))
				.innerJoin(Region, eq(Territory.regionId, Region.id))
				.innerJoin(ReportsTo, eq(Employee.reportsTo, ReportsTo.id))
				.where(eq(Employee.id, Number(id)))

			const [{ employee, reportsTo, territory, region }] = await query
			if (!employee) throw Boom.notFound()

			const abs = query.toSQL()

			return res.json({
				employee,
				reportsTo,
				territory,
				region,
				sequel: query.toSQL()
			})
		},

		async suppliers(req, res) {
			const { offset, limit } = req.query

			const query = db.select().from(Supplier).offset(offset).limit(limit)
			const suppliers = await query

			return res.json({ suppliers, sequel: query.toSQL() })
		},

		async supplier(req, res) {
			const { id } = req.params

			const query = db
				.select()
				.from(Supplier)
				.where(eq(Supplier.id, Number(id)))

			const [supplier] = await query
			if (!supplier) throw Boom.notFound()

			return res.json({ supplier, sequel: query.toSQL() })
		},

		async products(req, res) {
			const { offset, limit } = req.query

			const query = db.select().from(Product).offset(offset).limit(limit)
			const products = await query

			return res.json({ products, sequel: query.toSQL() })
		},

		async product(req, res) {
			const { id } = req.params

			const query = db
				.select()
				.from(Product)
				.innerJoin(Supplier, eq(Product.supplierId, Supplier.id))
				.innerJoin(Category, eq(Product.categoryId, Category.id))
				.where(eq(Product.id, Number(id)))

			const products = await query
			if (!products.length) throw Boom.notFound()

			const [{ category, product, supplier }] = products

			return res.json({ category, product, supplier, sequel: query.toSQL() })
		},

		async orders(req, res) {
			const { offset, limit } = req.query

			const query = db.select().from(Order).offset(offset).limit(limit)
			const orders = await query

			return res.json({ orders, sequel: query.toSQL() })
		},

		async order(req, res) {
			const { id } = req.params

			const query = db
				.select()
				.from(Order)
				.innerJoin(Customer, eq(Order.customerId, Customer.id))
				.innerJoin(Shipper, eq(Order.shipperId, Shipper.id))
				.innerJoin(OrderDetails, eq(Order.id, OrderDetails.orderId))
				.innerJoin(Product, eq(OrderDetails.productId, Product.id))
				.where(eq(Order.id, Number(id)))

			const orders = await query
			if (!orders.length) throw Boom.notFound()

			const [{ tradeorder: order, customer, shipper }] = orders
			const details = orders.map((e) => ({ ...e.order_details, product: e.product }))

			return res.json({
				order,
				customer,
				shipper,
				details,
				sequel: query.toSQL()
			})
		}
	}
}

export = GetDataController
