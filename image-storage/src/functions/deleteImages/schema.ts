import { z } from 'zod'

export = {
	body: z.object({
		fileName: z.string()
	}),
	headers: z.any(),
	pathParameters: z.any(),
	queryStringParameters: z.any()
} as const
