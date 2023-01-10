import { RequestHandler } from 'express'
import * as Boom from '@hapi/boom'

export = <RequestHandler>((req, res, next) => {
	if (typeof req.headers['tab-uuid'] !== 'string')
		throw Boom.badRequest('Error: must present tab id in headers.tabUUID')
	return next()
})
