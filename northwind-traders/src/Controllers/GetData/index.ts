import * as Boom from '@hapi/boom'
import { eq, or } from 'drizzle-orm/expressions'
import Orm from '@Database/Northwind'
import { dbLogger } from '@Util/DbLogger'

import type { RequestHandler } from 'express'

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

//Linked:
// Product: Supplier, Category
// Employee: Self-link reports-to, Territory
// Territory: region
// Order: Customer, Employee, Shipper
// OrderDetails: Order, Product

class GetData {
	public Customers = <RequestHandler>(async (req, res, next) => {
		try {
			const db = await Orm.Connector.connect()
			const customers = await dbLogger(db.select(Customer))

			if (!customers.length) throw Boom.notFound()
			return res.json({ customers })
		} catch (e) {
			next(e)
		}
	})

	public Customer = <RequestHandler<{ id: string }>>(async (req, res, next) => {
		try {
			const db = await Orm.Connector.connect()
			const customers = await dbLogger(db.select(Customer).where(eq(Customer.id, req.params.id)))

			if (!customers.length) throw Boom.notFound()
			return res.json({ customer: customers[0] })
		} catch (e) {
			next(e)
		}
	})

	public Employees = <RequestHandler>(async (req, res, next) => {
		try {
			const db = await Orm.Connector.connect()
			const employees = await dbLogger(db.select(Employee))

			if (!employees.length) throw Boom.notFound()
			return res.json({ employees })
		} catch (e) {
			next(e)
		}
	})

	public Employee = <RequestHandler<{ id: string }>>(async (req, res, next) => {
		try {
			const db = await Orm.Connector.connect()
			const employees = await dbLogger(
				db
					.select(Employee)
					.innerJoin(EmployeeTerritory, eq(Employee.id, EmployeeTerritory.employeeId))
					.innerJoin(Territory, eq(EmployeeTerritory.territoryId, Territory.id))
					.innerJoin(Region, eq(Territory.regionId, Region.id))
					.where(eq(Employee.id, Number(req.params.id)))
			)

			if (!employees.length) throw Boom.notFound()

			const reportsTo = (
				await dbLogger(db.select(Employee).where(eq(Employee.id, employees[0].employee.reportsTo)))
			)[0]

			return res.json({
				employee: {
					...employees[0].employee,
					reportsTo: {
						id: reportsTo.id,
						firstName: reportsTo.firstName,
						lastName: reportsTo.lastName
					},
					territory: employees[0].territory.description,
					region: employees[0].region.description
				}
			})
		} catch (e) {
			next(e)
		}
	})

	public Suppliers = <RequestHandler>(async (req, res, next) => {
		try {
			const db = await Orm.Connector.connect()
			const suppliers = await dbLogger(db.select(Supplier))

			if (!suppliers.length) throw Boom.notFound()
			return res.json({ suppliers })
		} catch (e) {
			next(e)
		}
	})

	public Supplier = <RequestHandler<{ id: string }>>(async (req, res, next) => {
		try {
			const db = await Orm.Connector.connect()
			const suppliers = await dbLogger(db.select(Supplier).where(eq(Supplier.id, Number(req.params.id))))

			if (!suppliers.length) throw Boom.notFound()
			return res.json({ supplier: suppliers[0] })
		} catch (e) {
			next(e)
		}
	})

	public Products = <RequestHandler>(async (req, res, next) => {
		try {
			const db = await Orm.Connector.connect()
			const products = await dbLogger(db.select(Product))

			if (!products.length) throw Boom.notFound()
			return res.json({ products })
		} catch (e) {
			next(e)
		}
	})

	public Product = <RequestHandler<{ id: string }>>(async (req, res, next) => {
		try {
			const db = await Orm.Connector.connect()
			const products = await dbLogger(
				db
					.select(Product)
					.innerJoin(Supplier, eq(Product.supplierId, Supplier.id))
					.innerJoin(Category, eq(Product.categoryId, Category.id))
					.where(eq(Supplier.id, Number(req.params.id)))
			)

			if (!products.length) throw Boom.notFound()
			return res.json({
				...products[0]
			})
		} catch (e) {
			next(e)
		}
	})

	public Orders = <RequestHandler>(async (req, res, next) => {
		try {
			const db = await Orm.Connector.connect()
			const orders = await dbLogger(db.select(Order))

			if (!orders.length) throw Boom.notFound()
			return res.json({ orders })
		} catch (e) {
			next(e)
		}
	})

	public Order = <RequestHandler<{ id: string }>>(async (req, res, next) => {
		try {
			const db = await Orm.Connector.connect()
			const orders = await dbLogger(
				db
					.select(Order)
					.innerJoin(Customer, eq(Order.customerId, Customer.id))
					.innerJoin(Shipper, eq(Order.shipperId, Shipper.id))
					.innerJoin(OrderDetails, eq(Order.id, OrderDetails.orderId))
					.innerJoin(Product, eq(OrderDetails.productId, Product.id))
					.where(eq(Order.id, Number(req.params.id)))
			)

			if (!orders.length) throw Boom.notFound()
			return res.json({
				order: orders[0].order,
				customer: orders[0].customer,
				shipper: orders[0].shipper,
				details: orders.map((e) => ({ ...e.order_details, product: e.product }))
			})
		} catch (e) {
			next(e)
		}
	})
}

export = new GetData()
