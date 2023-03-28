import { z } from 'zod'
import globals from '@Globals/values'

const { paginationQuerySchema } = globals

export default {
	customer: z.object({
		query: paginationQuerySchema,
		params: z.object({
			name: z.string()
		})
	}),
	product: z.object({
		query: paginationQuerySchema,
		params: z.object({
			name: z.string()
		})
	}),
	emptyQuery: z.unknown()
}
