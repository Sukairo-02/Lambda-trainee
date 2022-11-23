import * as Boom from '@hapi/boom'
import { z, ZodType } from 'zod'
import type { Request } from 'express'

export = (req: Request, schema: ZodType) => {
	try {
		return schema.parse(req) as z.infer<typeof schema>
	} catch (e) {
		throw Boom.badRequest((<any>e).message)
		// const newError = Boom.badRequest((<ZodError>e).message)
		// newError.message = JSON.parse(newError.message)
		// throw (<ZodError>e).message ? newError : new Error('Error: Validation failed but empty error received')
	}
}
