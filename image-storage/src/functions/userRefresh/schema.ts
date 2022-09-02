import { z } from 'zod'

export = {
	body: z.any(),
	headers: z.object({
		Authorization: z.string().startsWith('Bearer ')
	}),
	pathParameters: z.any(),
	queryStringParameters: z.any()
} as const
