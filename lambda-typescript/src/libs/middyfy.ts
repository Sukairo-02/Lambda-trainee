import middy from '@middy/core'
import middyJsonBodyParser from '@middy/http-json-body-parser'
import Boom from '@hapi/boom'

import type { MiddlewareObj } from '@middy/core'
import type { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from 'aws-lambda'
import type { Boom as BoomType } from '@hapi/boom'
import type { ZodError, ZodSchema } from 'zod'

const validateAndFormat = (
	validationSchema?: ZodSchema
): MiddlewareObj<APIGatewayProxyEvent, APIGatewayProxyResult> => {
	return {
		before: async (request) => {
			try {
				validationSchema?.parse(request)
			} catch (e) {
				const newError = Boom.badRequest((<ZodError>e).message)
				newError.message = JSON.parse(newError.message)
				throw (<ZodError>e).message ? newError : new Error('Error: Validation failed but empty error received')
			}
		},

		after: async (request) => {
			request.response = {
				statusCode: 200,
				body: JSON.stringify(request.response, null, 2),
				headers: {
					'Content-Type': 'application/json'
				}
			}
		},

		onError: async (request) => {
			if ((<BoomType>request?.error).isBoom) {
				return {
					statusCode: (<BoomType>request.error).output.statusCode,
					body: JSON.stringify(
						{
							message: (<BoomType>request?.error)?.message || 'Something went wrong. Try again later...'
						},
						null,
						2
					),
					headers: {
						'Content-Type': 'application/json'
					}
				}
			} else {
				return {
					statusCode: 500,
					body: JSON.stringify({ message: 'Something went wrong. Try again later...' }, null, 2)
				}
			}
		}
	}
}

export = (handler: Handler<APIGatewayProxyEvent, APIGatewayProxyResult>, schema?: ZodSchema) => {
	return middy(handler).use(middyJsonBodyParser()).use(validateAndFormat(schema))
}
