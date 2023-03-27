import { z } from 'zod'

export default {
	paginationQuerySchema: z.object({
		offset: z
			.string()
			.transform((e) => {
				let num = Number(e)
				if (Number.isNaN(num)) num = 0
				if (num < 0) num = 0
				return num
			})
			.optional()
			.default('0'),
		limit: z
			.string()
			.transform((e) => {
				let num = Number(e)
				if (Number.isNaN(num)) num = 2147483647
				if (num < 0) num = 2147483647
				return num
			})
			.optional()
			.default('2147483647')
	})
}
