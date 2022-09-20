import { z } from 'zod'

export = {
	body: z.any(),
	headers: z.object({
		Refresh: z.string()
	}),
	pathParameters: z.any(),
	queryStringParameters: z.any()
} as const
