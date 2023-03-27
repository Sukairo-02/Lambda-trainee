import ParseRequest from '@Middleware/parseRequest'

import type { ZodType } from 'zod'
import type { RequestHandler } from 'express'
import type { AnyTypedHandler } from './types'

export default <T extends AnyTypedHandler, U extends ZodType>(controller: T, schema: U) => {
	const wrapped = <RequestHandler>(async (req, res, next) => {
		try {
			await controller(req, res, next)
		} catch (e) {
			next(e)
		}
	})

	return [ParseRequest(schema), wrapped]
}
