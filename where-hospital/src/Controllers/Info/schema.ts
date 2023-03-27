import { z } from 'zod'
import globals from '@Globals/values'

const { paginationQuerySchema } = globals

export default {
	city: z.object({
		query: paginationQuerySchema
	}),
	cityByState: z.object({
		query: paginationQuerySchema,
		params: z.object({
			stateSlug: z.string()
		})
	}),
	citySlug: z.object({
		params: z.object({
			citySlug: z.string()
		})
	}),
	suburb: z.object({
		query: paginationQuerySchema
	}),
	suburbByState: z.object({
		query: paginationQuerySchema,
		params: z.object({
			stateSlug: z.string()
		})
	}),
	suburbSlug: z.object({
		params: z.object({
			stateSlug: z.string(),
			suburbSlug: z.string()
		})
	}),
	nearbySuburbs: z.object({
		query: paginationQuerySchema,
		params: z.object({
			stateSlug: z.string(),
			suburbSlug: z.string()
		})
	}),
	clinic: z.object({
		query: paginationQuerySchema
	}),
	clinicSlug: z.object({
		params: z.object({
			clinicSlug: z.string()
		})
	})
}
