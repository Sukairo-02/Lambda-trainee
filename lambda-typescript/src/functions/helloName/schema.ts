import { z } from 'zod'

export = {
	body: z.object({
		name: z.string().min(2).max(40)
	}),
	headers: z.any(),
	pathParameters: z.any(),
	queryStringParameters: z.any()
} as const
