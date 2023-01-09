import readCsvs from './readCsvs'
import Orm from '@Database/Northwind'
import { eq } from 'drizzle-orm/expressions'

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

const start = async () => {
	const categories = (await readCsvs.Category()).map((e) => ({
		id: Number(e.CategoryID),
		name: e.CategoryName,
		description: e.Description
	}))
	const suppliers = (await readCsvs.Supplier()).map((e) => ({
		id: Number(e.SupplierID),
		companyName: e.CompanyName,
		contactName: e.ContactName,
		contactTitle: e.ContactTitle,
		address: e.Address,
		city: e.City,
		region: e.Region,
		postcode: e.PostalCode,
		phone: e.Phone,
		fax: e.Fax,
		homepage: e.HomePage
	}))

	const products = (await readCsvs.Product()).map((e) => ({
		id: Number(e.ProductID),
		name: e.ProductName,
		supplierId: Number(e.SupplierID),
		categoryId: Number(e.CategoryID),
		quantityPerUnit: e.QuantityPerUnit,
		unitPrice: Number(e.UnitPrice),
		inStock: Number(e.UnitsInStock),
		inOrder: Number(e.UnitsOnOrder),
		reorderLevel: Number(e.ReorderLevel),
		discontinued: e.Discontinued === '1' ? true : false
	}))

	const customers = (await readCsvs.Customer()).map((e) => ({
		id: e.CustomerID,
		companyName: e.CompanyName,
		contactName: e.ContactName,
		contactTitle: e.ContactTitle,
		address: e.Address,
		city: e.City,
		region: e.Region,
		postcode: e.PostalCode,
		phone: e.Phone,
		fax: e.Fax
	}))

	const regions = (await readCsvs.Region()).map((e) => ({
		id: Number(e.RegionID),
		description: e.RegionDescription
	}))

	const employees = (await readCsvs.Employee()).map((e) => ({
		id: Number(e.EmployeeID),
		reportsTo: Number(e.ReportsTo),
		lastName: e.LastName,
		firstName: e.FirstName,
		title: e.Title,
		titleOfCourtesy: e.TitleOfCourtesy,
		birthDate: e.BirthDate ? e.BirthDate : Date().toString(),
		hireDate: e.HireDate ? e.HireDate : Date().toString(),
		address: e.Address,
		city: e.City,
		region: e.Region,
		postcode: e.PostalCode,
		county: e.Country,
		homePhone: e.HomePhone,
		extension: e.Extension,
		notes: e.Notes
	}))

	const territories = (await readCsvs.Territory()).map((e) => ({
		id: Number(e.TerritoryID),
		description: e.TerritoryDescription,
		regionId: Number(e.RegionID)
	}))

	const employeeTerritories = (await readCsvs.EmployeeTerritory()).map((e) => ({
		employeeId: Number(e.EmployeeID),
		territoryId: Number(e.TerritoryID)
	}))

	const shippers = (await readCsvs.Shipper()).map((e) => ({
		id: Number(e.ShipperID),
		name: e.CompanyName,
		phone: e.Phone
	}))

	const orders = (await readCsvs.Order()).map((e) => ({
		id: Number(e.OrderID),
		customerId: e.CustomerID,
		employeeId: Number(e.EmployeeID),
		orderDate: e.OrderDate ? e.OrderDate : undefined,
		requiredDate: e.RequiredDate ? e.RequiredDate : Date().toString(),
		shippedDate: e.ShippedDate ? e.ShippedDate : undefined,
		shipperId: Number(e.ShipVia),
		freight: Number(e.Freight),
		shipName: e.ShipName,
		shipAddress: e.ShipAddress,
		shipCity: e.ShipCity,
		shipRegion: e.ShipRegion,
		shipPostcode: e.ShipPostalCode,
		shipCountry: e.ShipCountry
	}))

	const orderDetails = (await readCsvs.OrderDetails()).map((e) => ({
		orderId: Number(e.OrderID),
		productId: Number(e.ProductID),
		unitPrice: Number(e.UnitPrice),
		quantity: Number(e.Quantity),
		discount: Number(e.Discount)
	}))

	const employeesNoReportsTo = employees.map((e) => ({ ...e, reportsTo: employees[0].reportsTo }))

	await db.delete(OrderDetails)
	await db.delete(Order)
	await db.delete(EmployeeTerritory)
	await db.delete(Employee)
	await db.delete(Territory)
	await db.delete(Region)
	await db.delete(Customer)
	await db.delete(Product)
	await db.delete(Category)
	await db.delete(Shipper)
	await db.delete(Supplier)

	await db.insert(Supplier).values(...suppliers)
	await db.insert(Shipper).values(...shippers)
	await db.insert(Category).values(...categories)
	await db.insert(Product).values(...products)
	await db.insert(Customer).values(...customers)
	await db.insert(Region).values(...regions)
	await db.insert(Territory).values(...territories)
	await db.insert(Employee).values(...employeesNoReportsTo)
	await db.insert(EmployeeTerritory).values(...employeeTerritories)
	await db.insert(Order).values(...orders)
	await db.insert(OrderDetails).values(...orderDetails)

	for (const e of employees) {
		await db.update(Employee).set({ reportsTo: e.reportsTo }).where(eq(Employee.id, e.id))
	}
}

start()
