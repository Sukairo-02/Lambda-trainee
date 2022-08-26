import type { ZodSchema } from 'zod'

export type schemaContainer = {
	body: ZodSchema
	headers: ZodSchema
	pathParameters: ZodSchema
	queryStringParameters: ZodSchema
}
