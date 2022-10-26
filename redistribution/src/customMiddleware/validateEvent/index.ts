import Boom from '@hapi/boom'

import type { MiddlewareObj } from '@middy/core'
import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import type { ZodError, ZodSchema } from 'zod'

export = (validationSchema?: ZodSchema): MiddlewareObj<APIGatewayProxyEvent, APIGatewayProxyResult> => {
	return {
		before: async (event) => {
			try {
				validationSchema?.parse(event.event)
			} catch (e) {
				console.error(event)
				const newError = Boom.badRequest((<ZodError>e).message)
				newError.message = JSON.parse(newError.message)
				throw (<ZodError>e).message ? newError : new Error('Error: Validation failed but empty error received')
			}
		}
	}
}
