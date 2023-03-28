import { pgTable, integer, serial, varchar, boolean, foreignKey, date, real } from 'drizzle-orm/pg-core'

export const Category = pgTable('category', {
	id: serial('id').notNull().primaryKey(),
	name: varchar('name').notNull(),
	description: varchar('description').notNull()
})

export const Supplier = pgTable('supplier', {
	id: serial('id').notNull().primaryKey(),
	companyName: varchar('company_name').notNull(),
	contactName: varchar('contact_name'),
	contactTitle: varchar('contact_title'),
	address: varchar('address').notNull(),
	city: varchar('city').notNull(),
	region: varchar('region'),
	postcode: varchar('postcode'),
	phone: varchar('phone').notNull(),
	fax: varchar('fax'),
	homepage: varchar('homepage')
})

export const Product = pgTable('product', {
	id: serial('id').notNull().primaryKey(),
	name: varchar('name').notNull(),
	supplierId: integer('supplier_id')
		.notNull()
		.references(() => Supplier.id),
	categoryId: integer('category_id')
		.notNull()
		.references(() => Category.id),
	quantityPerUnit: varchar('quantity_per_unit').notNull(),
	unitPrice: real('unit_price').notNull(),
	inStock: integer('in_stock').notNull().default(0),
	inOrder: integer('in_order').notNull().default(0),
	reorderLevel: integer('reorder_level').notNull().default(0),
	discontinued: boolean('discontinued').notNull().default(false)
})

export const Customer = pgTable('customer', {
	id: varchar('id').notNull().primaryKey(),
	companyName: varchar('company_name').notNull(),
	contactName: varchar('contact_name'),
	contactTitle: varchar('contact_title'),
	address: varchar('address'),
	city: varchar('city'),
	region: varchar('region'),
	postcode: varchar('postcode'),
	phone: varchar('phone'),
	fax: varchar('fax')
})

export const Region = pgTable('region', {
	id: serial('id').notNull().primaryKey(),
	description: varchar('description').notNull()
})

export const Employee = pgTable(
	'employee',
	{
		id: serial('id').notNull().primaryKey(),
		reportsTo: integer('reports_to').notNull(),
		lastName: varchar('last_name'),
		firstName: varchar('first_name').notNull(),
		title: varchar('title').notNull(),
		titleOfCourtesy: varchar('title_of_courtesy').notNull().default('Mr.'),
		birthDate: date('birth_date').notNull(),
		hireDate: date('hireDate').notNull(),
		address: varchar('address').notNull(),
		city: varchar('city').notNull(),
		region: varchar('region'),
		postcode: varchar('postcode'),
		country: varchar('country'),
		homePhone: varchar('home_phone'),
		extension: varchar('extension'),
		notes: varchar('notes')
	},
	(Employee) => ({
		reportsSelfRef: foreignKey({
			columns: [Employee.reportsTo],
			foreignColumns: [Employee.id]
		})
	})
)

export const Territory = pgTable('territory', {
	id: serial('id').notNull().primaryKey(),
	description: varchar('description').notNull(),
	regionId: integer('region_id')
		.references(() => Region.id)
		.notNull()
})

export const EmployeeTerritory = pgTable('employee_territory', {
	employeeId: integer('employee_id')
		.references(() => Employee.id)
		.notNull(),
	territoryId: integer('territory_id')
		.references(() => Territory.id)
		.notNull()
})

export const Shipper = pgTable('shipper', {
	id: serial('id').notNull().primaryKey(),
	name: varchar('name').notNull(),
	phone: varchar('phone').notNull()
})

export const Order = pgTable('tradeorder', {
	id: serial('id').notNull().primaryKey(),
	customerId: varchar('customer_id')
		.notNull()
		.references(() => Customer.id),
	employeeId: integer('employee_id')
		.notNull()
		.references(() => Employee.id),
	orderDate: date('order_date').notNull().defaultNow(),
	requiredDate: date('required_date').notNull(),
	shippedDate: date('shipped_date'),
	shipperId: integer('shipper_id')
		.notNull()
		.references(() => Shipper.id),
	freight: real('freight').notNull(),
	shipName: varchar('ship_name').notNull(),
	shipAddress: varchar('ship_address').notNull(),
	shipCity: varchar('ship_city').notNull(),
	shipRegion: varchar('ship_region'),
	shipPostcode: varchar('ship_postcode'),
	shipCountry: varchar('ship_country')
})

export const OrderDetails = pgTable('order_details', {
	orderId: integer('orderId')
		.references(() => Order.id)
		.notNull(),
	productId: integer('product_id')
		.notNull()
		.references(() => Product.id),
	unitPrice: real('unit_price').notNull(),
	quantity: integer('quantity').notNull().default(1),
	discount: real('discount').notNull().default(0)
})
