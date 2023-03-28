export type Categories = {
	CategoryID: string
	CategoryName: string
	Description: string
}[]

export type Suppliers = {
	SupplierID: string
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
	HomePage: string
}[]

export type Products = {
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

export type Customers = {
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

export type Regions = {
	RegionID: string
	RegionDescription: string
}[]

export type Territories = {
	TerritoryID: string
	TerritoryDescription: string
	RegionID: string
}[]

export type Employees = {
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

export type EmployeeTerritories = {
	EmployeeID: string
	TerritoryID: string
}[]

export type Shippers = {
	ShipperID: string
	CompanyName: string
	Phone: string
}[]

export type Orders = {
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

export type OrderDetails = {
	OrderID: string
	ProductID: string
	UnitPrice: string
	Quantity: string
	Discount: string
}[]
