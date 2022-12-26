import { pgTable, integer, serial, text, boolean, foreignKey, date, real, timestamp } from 'drizzle-orm-pg'

export const Category = pgTable('category', {
	id: serial('id').notNull().primaryKey(),
	name: text('name').notNull(),
	description: text('description').notNull()
})

export const Supplier = pgTable('supplier', {
	id: serial('id').notNull().primaryKey(),
	companyName: text('company_name').notNull(),
	contactName: text('contact_name'),
	contactTitle: text('contact_title'),
	address: text('address').notNull(),
	city: text('city').notNull(),
	region: text('region'),
	postcode: text('postcode'),
	phone: text('phone').notNull(),
	fax: text('fax'),
	homepage: text('homepage')
})

export const Product = pgTable('product', {
	id: serial('id').notNull().primaryKey(),
	name: text('name').notNull(),
	supplierId: integer('supplier_id')
		.notNull()
		.references(() => Supplier.id),
	categoryId: integer('category_id')
		.notNull()
		.references(() => Category.id),
	quantityPerUnit: text('quantity_per_unit').notNull(),
	unitPrice: real('unit_price').notNull(),
	inStock: integer('in_stock').notNull().default(0),
	inOrder: integer('in_order').notNull().default(0),
	reorderLevel: integer('reorder_level').notNull().default(0),
	discontinued: boolean('discontinued').notNull().default(false)
})

export const Customer = pgTable('customer', {
	id: text('id').notNull().primaryKey(),
	companyName: text('company_name').notNull(),
	contactName: text('contact_name'),
	contactTitle: text('contact_title'),
	address: text('address'),
	city: text('city'),
	region: text('region'),
	postcode: text('postcode'),
	phone: text('phone'),
	fax: text('fax')
})

export const Region = pgTable('region', {
	id: serial('id').notNull().primaryKey(),
	description: text('description').notNull()
})

export const Employee = pgTable(
	'employee',
	{
		id: serial('id').notNull().primaryKey(),
		reportsTo: integer('reports_to').notNull(), //.references(() => Employee.reportsTo),
		lastName: text('last_name'),
		firstName: text('first_name').notNull(),
		title: text('title').notNull(),
		titleOfCourtesy: text('title_of_courtesy').notNull().default('Mr.'),
		birthDate: date('birth_date').notNull(),
		hireDate: date('hireDate').notNull(),
		address: text('address').notNull(),
		city: text('city').notNull(),
		region: text('region'),
		postcode: text('postcode'),
		country: text('country'),
		homePhone: text('home_phone'),
		extension: text('extension'),
		notes: text('notes')
	},
	(Employee) => ({
		reportsSelfref: foreignKey(() => ({
			//selfreferencing via .references() leads to conversion of type to Any
			columns: [Employee.reportsTo],
			foreignColumns: [Employee.id]
		}))
	})
)

export const Territory = pgTable('territory', {
	id: serial('id').notNull().primaryKey(),
	description: text('description').notNull(),
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
	name: text('name').notNull(),
	phone: text('phone').notNull()
})

export const Order = pgTable('order', {
	id: serial('id').notNull().primaryKey(),
	customerId: text('customer_id')
		.notNull()
		.references(() => Customer.id),
	employeeId: text('employee_id')
		.notNull()
		.references(() => Employee.id),
	orderDate: date('order_date').notNull().defaultNow(),
	requiredDate: date('required_date').notNull(),
	shippedDate: date('shipped_date'),
	shipperId: integer('shipper_id')
		.notNull()
		.references(() => Shipper.id),
	freight: real('freight').notNull(),
	shipName: text('ship_name').notNull(),
	shipAddress: text('ship_address').notNull(),
	shipCity: text('ship_city').notNull(),
	shipRegion: text('ship_region'),
	shipPostcode: text('ship_postcode'),
	shipCountry: text('ship_country')
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

export const AdminLogs = pgTable('admin_logs', {
	id: serial('id').notNull().primaryKey(),
	query: text('query').notNull(),
	sender: text('sender').notNull().default('server'),
	timestamp: timestamp('timestamp').defaultNow()
})
