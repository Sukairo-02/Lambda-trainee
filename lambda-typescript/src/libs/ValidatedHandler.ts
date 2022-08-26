import type { APIGatewayProxyEvent, APIGatewayProxyResultV2, Handler } from 'aws-lambda'
import { z, ZodType } from 'zod'

type ValidatedAPIGatewayProxyEvent<
	Body extends ZodType,
	Headers extends ZodType,
	Path extends ZodType,
	Query extends ZodType
> = Omit<Omit<Omit<Omit<APIGatewayProxyEvent, 'body'>, 'headers'>, 'pathParameters'>, 'queryStringParameters'> & {
	body: z.infer<Body>
	headers: z.infer<Headers>
	pathParameters: z.infer<Path>
	queryStringParameters: z.infer<Query>
}

export type ValidatedHandler<
	Body extends ZodType,
	Headers extends ZodType,
	Path extends ZodType,
	Query extends ZodType
> = Handler<ValidatedAPIGatewayProxyEvent<Body, Headers, Path, Query>, APIGatewayProxyResultV2>
