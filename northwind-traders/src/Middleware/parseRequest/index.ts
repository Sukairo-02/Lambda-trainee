import * as Boom from '@hapi/boom'

import type { ZodType } from 'zod'
import type { RequestHandler } from 'express'

export = <T extends ZodType>(schema: T) => {
	return <RequestHandler>((req, res, next) => {
		const parsedRequest = schema.safeParse(req)
		if (!parsedRequest.success) throw Boom.badRequest('Invalid input', parsedRequest.error.errors)

		req = { ...req, ...parsedRequest.data }
		next()
	})
}
