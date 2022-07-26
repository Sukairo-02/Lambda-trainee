import type { RequestHandler } from 'express'

declare global {
	namespace Express {
		interface Request {
			dbUser: string
		}
	}
}

export = <RequestHandler>((req, res, next) => {
	if (!req.query.user || !(req.query.user instanceof String || typeof req.query.user === 'string')) {
		return res.status(403).send('Invalid user!')
	}

	req.dbUser = <string>req.query.user
	return next()
})
