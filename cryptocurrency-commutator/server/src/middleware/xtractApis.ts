import type { RequestHandler } from 'express'
import apiList from '@util/lists/apiList'

declare global {
	namespace Express {
		interface Request {
			apis?: {
				accepted: string[]
				dismissed: string[]
			}
		}
	}
}

export = <RequestHandler>((req, res, next) => {
	if (req.query.apis && !(req.query.apis instanceof String || typeof req.query.apis === 'string')) {
		return res.status(403).send('Invalid api!')
	}

	const result: {
		accepted: string[]
		dismissed: string[]
	} = {
		accepted: [],
		dismissed: []
	}

	;(<string | undefined>req.query.apis)
		?.split(',')
		.forEach((e) => (apiList.has(e) ? result.accepted.push(e) : result.dismissed.push(e)))

	if (req.query.apis && !result.accepted.length) {
		return res.status(403).json({
			errors: { message: 'APIs have been requested, but none of the valid found', dismissed: result.dismissed }
		})
	}

	req.apis = result
	return next()
})
