import s from './schema'

import type { SqlQuery } from '@Globals/types'
import type { TypedHandler } from '@Util/TypedHandler'

export type SearchControllerHandlers = {
	customer: TypedHandler<
		typeof s.customer,
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
	product: TypedHandler<
		typeof s.product,
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
	emptyQuery: TypedHandler<typeof s.emptyQuery, void[]>
}

export default SearchControllerHandlers
