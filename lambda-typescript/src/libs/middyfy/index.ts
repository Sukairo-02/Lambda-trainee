import middy from '@middy/core'
import middyJsonBodyParser from '@middy/http-json-body-parser'

import validateEvent from './validateEvent'
import formatResponse from './formatResponse'
import catchErrors from './catchErrors'

import type { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from 'aws-lambda'
import type { ZodSchema } from 'zod'
import type { MiddyConfig } from './types'

export = (
	handler: Handler<APIGatewayProxyEvent, APIGatewayProxyResult>,
	schema?: ZodSchema | undefined,
	config: MiddyConfig = {
		parseBody: middyJsonBodyParser,
		validateEvent: true,
		formatResponse: true,
		catchErrors: true
	}
) => {
	let middyfied: any = middy(handler)
	middyfied = config.parseBody ? middyfied.use(config.parseBody()) : middyfied
	middyfied = config.validateEvent ? middyfied.use(validateEvent(schema)) : middyfied
	middyfied = config.formatResponse ? middyfied.use(formatResponse()) : middyfied
	middyfied = config.catchErrors ? middyfied.use(catchErrors()) : middyfied

	return middyfied
}
