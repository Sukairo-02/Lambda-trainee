import csv from 'csvtojson'

const basePath = `${__dirname}/../../rawData`

export = {
	Category: async () => {
		return (<unknown>csv().fromFile(`${basePath}/Categories.csv`)) as Promise<
			{
				CategoryID: string
				CategoryName: string
				Description: string
			}[]
		>
	},

	Supplier: async () => {
		return (<unknown>csv().fromFile(`${basePath}/Suppliers.csv`)) as Promise<
			{
				SupplierID: string
				CompanyName: string
				ContactName: string
				ContactTitle: string
				Address: string
				City: string
				PostalCode: string
				Country: string
				Phone: string
				Fax: string
				HomePage: string
			}[]
		>
	},

	Product: async () => {
		return (<unknown>csv().fromFile(`${basePath}/Products.csv`)) as Promise<
			{
				ProductID: string
				ProductName: string
				SupplierID: string
				CategoryID: string
				QuantityPerUnit: string
				UnitPrice: string
				UnitsInStock: string
				UnitsOnOrder: string
				ReorderLevel: string
				Discontinued: '0' | '1'
			}[]
		>
	},

	Customer: async () => {
		return (<unknown>csv().fromFile(`${basePath}/Customers.csv`)) as Promise<
			{
				CustomerID: string
				CompanyName: string
				ContactName: string
				ContactTitle: string
				Address: string
				City: string
				Region: string
				PostalCode: string
				Country: string
				Phone: string
				Fax: string
			}[]
		>
	},

	Region: async () => {
		return (<unknown>csv().fromFile(`${basePath}/Regions.csv`)) as Promise<
			{
				RegionID: string
				RegionDescription: string
			}[]
		>
	},

	Territory: async () => {
		return (<unknown>csv().fromFile(`${basePath}/Territories.csv`)) as Promise<
			{
				TerritoryID: string
				TerritoryDescription: string
				RegionID: string
			}[]
		>
	},

	Employee: async () => {
		return (<unknown>csv().fromFile(`${basePath}/Employees.csv`)) as Promise<
			{
				EmployeeID: string
				LastName: string
				FirstName: string
				Title: string
				TitleOfCourtesy: string
				BirthDate: string
				HireDate: string
				Address: string
				City: string
				Region: string
				PostalCode: string
				Country: string
				HomePhone: string
				Extension: string
				Notes: string
				ReportsTo: string
			}[]
		>
	},

	EmployeeTerritory: async () => {
		return (<unknown>csv().fromFile(`${basePath}/EmployeeTerritories.csv`)) as Promise<
			{
				EmployeeID: string
				TerritoryID: string
			}[]
		>
	},

	Shipper: async () => {
		return (<unknown>csv().fromFile(`${basePath}/Shippers.csv`)) as Promise<
			{
				ShipperID: string
				CompanyName: string
				Phone: string
			}[]
		>
	},

	Order: async () => {
		return (<unknown>csv().fromFile(`${basePath}/Orders.csv`)) as Promise<
			{
				OrderID: string
				CustomerID: string
				EmployeeID: string
				OrderDate: string
				RequiredDate: string
				ShippedDate: string
				ShipVia: string
				Freight: string
				ShipName: string
				ShipAddress: string
				ShipCity: string
				ShipRegion: string
				ShipPostalCode: string
				ShipCountry: string
			}[]
		>
	},

	OrderDetails: async () => {
		return (<unknown>csv().fromFile(`${basePath}/OrderDetails.csv`)) as Promise<
			{
				OrderID: string
				ProductID: string
				UnitPrice: string
				Quantity: string
				Discount: string
			}[]
		>
	}
}
