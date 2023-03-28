import csv from 'csvtojson'

import type {
	Categories,
	Customers,
	EmployeeTerritories,
	Employees,
	OrderDetails,
	Orders,
	Products,
	Regions,
	Shippers,
	Suppliers,
	Territories
} from './types'

const basePath = `${__dirname}/../../../rawData`

export = {
	Category: () => {
		return (<unknown>csv().fromFile(`${basePath}/Categories.csv`)) as Promise<Categories>
	},

	Supplier: () => {
		return (<unknown>csv().fromFile(`${basePath}/Suppliers.csv`)) as Promise<Suppliers>
	},

	Product: () => {
		return (<unknown>csv().fromFile(`${basePath}/Products.csv`)) as Promise<Products>
	},

	Customer: () => {
		return (<unknown>csv().fromFile(`${basePath}/Customers.csv`)) as Promise<Customers>
	},

	Region: () => {
		return (<unknown>csv().fromFile(`${basePath}/Regions.csv`)) as Promise<Regions>
	},

	Territory: () => {
		return (<unknown>csv().fromFile(`${basePath}/Territories.csv`)) as Promise<Territories>
	},

	Employee: () => {
		return (<unknown>csv().fromFile(`${basePath}/Employees.csv`)) as Promise<Employees>
	},

	EmployeeTerritory: () => {
		return (<unknown>csv().fromFile(`${basePath}/EmployeeTerritories.csv`)) as Promise<EmployeeTerritories>
	},

	Shipper: () => {
		return (<unknown>csv().fromFile(`${basePath}/Shippers.csv`)) as Promise<Shippers>
	},

	Order: () => {
		return (<unknown>csv().fromFile(`${basePath}/Orders.csv`)) as Promise<Orders>
	},

	OrderDetails: () => {
		return (<unknown>csv().fromFile(`${basePath}/OrderDetails.csv`)) as Promise<OrderDetails>
	}
}
