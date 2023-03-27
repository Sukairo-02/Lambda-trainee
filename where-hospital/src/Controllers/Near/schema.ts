import { z } from 'zod'
import globals from '@Globals/values'

const { paginationQuerySchema } = globals

export default {
	city: z.object({
		query: paginationQuerySchema,
		params: z.object({
			citySlug: z.string()
		})
	}),
	postcode: z.object({
		query: paginationQuerySchema,
		params: z.object({
			postcode: z.string()
		})
	}),
	suburb: z.object({
		query: paginationQuerySchema,
		params: z.object({
			stateSlug: z.string(),
			suburbSlug: z.string()
		})
	})
}
