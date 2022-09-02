import { z } from 'zod'

export = {
	body: z.object({
		email: z.string().email(),
		password: z.string().min(6)
	}),
	headers: z.any(),
	pathParameters: z.any(),
	queryStringParameters: z.any()
} as const
