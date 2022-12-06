import * as Boom from '@hapi/boom'
import { z, ZodType } from 'zod'
import type { Request } from 'express'

export = (req: Request, schema: ZodType) => {
	try {
		return schema.parse(req) as z.infer<typeof schema>
	} catch (e) {
		throw Boom.badRequest((<any>e).message)
	}
}
