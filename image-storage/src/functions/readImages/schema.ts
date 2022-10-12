import { z } from 'zod'

export = {
	body: z
		.object({
			images: z.array(z.string()).optional().nullish()
		})
		.nullish(),
	headers: z.any(),
	pathParameters: z.any(),
	queryStringParameters: z.any()
} as const
