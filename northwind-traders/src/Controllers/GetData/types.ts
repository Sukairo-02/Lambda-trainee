import s from './schema'

import type { SqlQuery } from '@Globals/types'
import type { TypedHandler } from '@Util/TypedHandler'

export type GetDataControllerHandlers = {
	customers: TypedHandler<
		typeof s.customers,
		{
			customers: {
				id: string
				companyName: string
				contactName: string | null
				contactTitle: string | null
				address: string | null
				city: string | null
				region: string | null
				postcode: string | null
				phone: string | null
				fax: string | null
			}[]
			sequel: SqlQuery
		}
	>
	customer: TypedHandler<
		typeof s.customer,
		{
			customer: {
				id: string
				companyName: string
				contactName: string | null
				contactTitle: string | null
				address: string | null
				city: string | null
				region: string | null
				postcode: string | null
				phone: string | null
				fax: string | null
			}
			sequel: SqlQuery
		}
	>
	employees: TypedHandler<
		typeof s.employees,
		{
			employees: {
				id: number
				address: string
				city: string
				region: string | null
				postcode: string | null
				reportsTo: number
				lastName: string | null
				firstName: string
				title: string
				titleOfCourtesy: string
				birthDate: string
				hireDate: string
				country: string | null
				homePhone: string | null
				extension: string | null
				notes: string | null
			}[]
			sequel: SqlQuery
		}
	>
	employee: TypedHandler<
		typeof s.employee,
		{
			employee: {
				id: number
				address: string
				city: string
				region: string | null
				postcode: string | null
				reportsTo: number
				lastName: string | null
				firstName: string
				title: string
				titleOfCourtesy: string
				birthDate: string
				hireDate: string
				country: string | null
				homePhone: string | null
				extension: string | null
				notes: string | null
			}
			reportsTo: {
				id: number
				address: string
				city: string
				region: string | null
				postcode: string | null
				reportsTo: number
				lastName: string | null
				firstName: string
				title: string
				titleOfCourtesy: string
				birthDate: string
				hireDate: string
				country: string | null
				homePhone: string | null
				extension: string | null
				notes: string | null
			}
			territory: {
				id: number
				description: string
				regionId: number
			}
			region: {
				id: number
				description: string
			}
			sequel: SqlQuery
		}
	>
	suppliers: TypedHandler<
		typeof s.suppliers,
		{
			suppliers: {
				id: number
				companyName: string
				contactName: string | null
				contactTitle: string | null
				address: string
				city: string
				region: string | null
				postcode: string | null
				phone: string
				fax: string | null
				homepage: string | null
			}[]
			sequel: SqlQuery
		}
	>
	supplier: TypedHandler<
		typeof s.supplier,
		{
			supplier: {
				id: number
				companyName: string
				contactName: string | null
				contactTitle: string | null
				address: string
				city: string
				region: string | null
				postcode: string | null
				phone: string
				fax: string | null
				homepage: string | null
			}
			sequel: SqlQuery
		}
	>
	products: TypedHandler<
		typeof s.products,
		{
			products: {
				id: number
				name: string
				supplierId: number
				categoryId: number
				quantityPerUnit: string
				unitPrice: number
				inStock: number
				inOrder: number
				reorderLevel: number
				discontinued: boolean
			}[]
			sequel: SqlQuery
		}
	>
	product: TypedHandler<
		typeof s.product,
		{
			category: {
				id: number
				name: string
				description: string
			}
			product: {
				id: number
				name: string
				supplierId: number
				categoryId: number
				quantityPerUnit: string
				unitPrice: number
				inStock: number
				inOrder: number
				reorderLevel: number
				discontinued: boolean
			}
			supplier: {
				id: number
				companyName: string
				contactName: string | null
				contactTitle: string | null
				address: string
				city: string
				region: string | null
				postcode: string | null
				phone: string
				fax: string | null
				homepage: string | null
			}
			sequel: SqlQuery
		}
	>
	orders: TypedHandler<
		typeof s.orders,
		{
			orders: {
				id: number
				employeeId: number
				customerId: string
				orderDate: string
				requiredDate: string
				shippedDate: string | null
				shipperId: number
				freight: number
				shipName: string
				shipAddress: string
				shipCity: string
				shipRegion: string | null
				shipPostcode: string | null
				shipCountry: string | null
			}[]
			sequel: SqlQuery
		}
	>
	order: TypedHandler<
		typeof s.order,
		{
			order: {
				id: number
				employeeId: number
				customerId: string
				orderDate: string
				requiredDate: string
				shippedDate: string | null
				shipperId: number
				freight: number
				shipName: string
				shipAddress: string
				shipCity: string
				shipRegion: string | null
				shipPostcode: string | null
				shipCountry: string | null
			}
			customer: {
				id: string
				companyName: string
				contactName: string | null
				contactTitle: string | null
				address: string | null
				city: string | null
				region: string | null
				postcode: string | null
				phone: string | null
				fax: string | null
			}
			shipper: {
				id: number
				name: string
				phone: string
			}
			details: {
				product: {
					id: number
					name: string
					supplierId: number
					categoryId: number
					quantityPerUnit: string
					unitPrice: number
					inStock: number
					inOrder: number
					reorderLevel: number
					discontinued: boolean
				}
				orderId: number
				unitPrice: number
				productId: number
				quantity: number
				discount: number
			}[]
			sequel: SqlQuery
		}
	>
}

export default GetDataControllerHandlers
