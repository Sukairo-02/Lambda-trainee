import * as Boom from '@hapi/boom'
import { eq } from 'drizzle-orm/expressions'
import { alias } from 'drizzle-orm-pg'
import Orm from '@Database/Northwind'

import type { RequestHandler } from 'express'

const db = Orm.Connector

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
} = Orm.Tables

const ReportsTo = alias(Employee, 'reportsTo')

//Linked:
// Product: Supplier, Category
// Employee: Self-link reports-to, Territory
// Territory: region
// Order: Customer, Employee, Shipper
// OrderDetails: Order, Product

class GetData {
	public Customers = <RequestHandler>(async (req, res, next) => {
		try {
			const query = db.select(Customer)
			const customers = await query

			return res.json({ customers, sequel: query.toSQL() })
		} catch (e) {
			next(e)
		}
	})

	public Customer = <RequestHandler<{ id: string }>>(async (req, res, next) => {
		try {
			const query = db.select(Customer).where(eq(Customer.id, req.params.id))
			const customers = await query

			if (!customers.length) throw Boom.notFound()
			return res.json({ customer: customers[0], sequel: query.toSQL() })
		} catch (e) {
			next(e)
		}
	})

	public Employees = <RequestHandler>(async (req, res, next) => {
		try {
			const query = db.select(Employee)
			const employees = await query

			return res.json({ employees, sequel: query.toSQL() })
		} catch (e) {
			next(e)
		}
	})

	public Employee = <RequestHandler<{ id: string }>>(async (req, res, next) => {
		try {
			const query = db
				.select(Employee)
				.innerJoin(EmployeeTerritory, eq(Employee.id, EmployeeTerritory.employeeId))
				.innerJoin(Territory, eq(EmployeeTerritory.territoryId, Territory.id))
				.innerJoin(Region, eq(Territory.regionId, Region.id))
				.innerJoin(ReportsTo, eq(Employee.reportsTo, ReportsTo.id))
				.where(eq(Employee.id, Number(req.params.id)))
			const employees = await query

			if (!employees.length) throw Boom.notFound()

			return res.json({
				employee: employees[0].employee,
				reportsTo: employees[0].reportsTo.firstName + ' ' + employees[0].reportsTo.lastName,
				territory: employees[0].territory.description,
				region: employees[0].region.description,
				sequel: query.toSQL()
			})
		} catch (e) {
			next(e)
		}
	})

	public Suppliers = <RequestHandler>(async (req, res, next) => {
		try {
			const query = db.select(Supplier)
			const suppliers = await query

			return res.json({ suppliers, sequel: query.toSQL() })
		} catch (e) {
			next(e)
		}
	})

	public Supplier = <RequestHandler<{ id: string }>>(async (req, res, next) => {
		try {
			const query = db.select(Supplier).where(eq(Supplier.id, Number(req.params.id)))
			const suppliers = await query

			if (!suppliers.length) throw Boom.notFound()
			return res.json({ supplier: suppliers[0], sequel: query.toSQL() })
		} catch (e) {
			next(e)
		}
	})

	public Products = <RequestHandler>(async (req, res, next) => {
		try {
			const query = db.select(Product)
			const products = await query

			return res.json({ products, sequel: query.toSQL() })
		} catch (e) {
			next(e)
		}
	})

	public Product = <RequestHandler<{ id: string }>>(async (req, res, next) => {
		try {
			const query = db
				.select(Product)
				.innerJoin(Supplier, eq(Product.supplierId, Supplier.id))
				.innerJoin(Category, eq(Product.categoryId, Category.id))
				.where(eq(Product.id, Number(req.params.id)))
			const products = await query

			if (!products.length) throw Boom.notFound()
			return res.json({ product: products[0], sequel: query.toSQL() })
		} catch (e) {
			next(e)
		}
	})

	public Orders = <RequestHandler>(async (req, res, next) => {
		try {
			const query = db.select(Order)
			const orders = await query

			return res.json({ orders, sequel: query.toSQL() })
		} catch (e) {
			next(e)
		}
	})

	public Order = <RequestHandler<{ id: string }>>(async (req, res, next) => {
		try {
			const query = db
				.select(Order)
				.innerJoin(Customer, eq(Order.customerId, Customer.id))
				.innerJoin(Shipper, eq(Order.shipperId, Shipper.id))
				.innerJoin(OrderDetails, eq(Order.id, OrderDetails.orderId))
				.innerJoin(Product, eq(OrderDetails.productId, Product.id))
				.where(eq(Order.id, Number(req.params.id)))
			const orders = await query

			if (!orders.length) throw Boom.notFound()
			return res.json({
				order: orders[0].tradeorder,
				customer: orders[0].customer,
				shipper: orders[0].shipper,
				details: orders.map((e) => ({ ...e.order_details, product: e.product })),
				sequel: query.toSQL()
			})
		} catch (e) {
			next(e)
		}
	})
}

export = new GetData()
