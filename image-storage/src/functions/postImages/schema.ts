import { z } from 'zod'

export = {
	body: z.any(),
	headers: z.any(),
	pathParameters: z.any(),
	queryStringParameters: z.any()
} as const
