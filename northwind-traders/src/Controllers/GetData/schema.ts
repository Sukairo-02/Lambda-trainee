import { z } from 'zod'
import * as Boom from '@hapi/boom'

import globals from '@Globals/values'

const { paginationQuerySchema } = globals

export default {
	customers: z.object({
		query: paginationQuerySchema
	}),
	customer: z.object({
		params: z.object({
			id: z.string()
		})
	}),
	employees: z.object({
		query: paginationQuerySchema
	}),
	employee: z.object({
		params: z.object({
			id: z.string().transform((e) => {
				const num = Number(e)
				if (Number.isNaN(num)) throw Boom.notFound()

				return num
			})
		})
	}),
	suppliers: z.object({
		query: paginationQuerySchema
	}),
	supplier: z.object({
		params: z.object({
			id: z.string().transform((e) => {
				const num = Number(e)
				if (Number.isNaN(num)) throw Boom.notFound()

				return num
			})
		})
	}),
	products: z.object({
		query: paginationQuerySchema
	}),
	product: z.object({
		params: z.object({
			id: z.string().transform((e) => {
				const num = Number(e)
				if (Number.isNaN(num)) throw Boom.notFound()

				return num
			})
		})
	}),
	orders: z.object({
		query: paginationQuerySchema
	}),
	order: z.object({
		params: z.object({
			id: z.string().transform((e) => {
				const num = Number(e)
				if (Number.isNaN(num)) throw Boom.notFound()

				return num
			})
		})
	})
}
