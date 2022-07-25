import type { RequestHandler } from 'express'
import apiList from '@util/lists/apiList'

declare global {
	namespace Express {
		interface Request {
			apis: {
				accepted?: string[] | undefined
				dismissed?: string[] | undefined
			}
		}
	}
}

export = <RequestHandler>((req, res, next) => {
	if (req.query.apis && !(req.query.apis instanceof String || typeof req.query.apis === 'string')) {
		return res.status(403).send('Invalid api!')
	}

	const result: {
		accepted: string[] | undefined
		dismissed: string[] | undefined
	} = {
		accepted: [],
		dismissed: []
	}

	const apis = (<string | undefined>req.query.apis)?.split(',').map((e) => e.toLowerCase())

	apis?.forEach((e) => (apiList.has(e) ? result.accepted?.push(e) : result.dismissed?.push(e)))

	if (req.query.apis && !result.accepted?.length) {
		return res.status(403).json(result)
	}

	if (!result.accepted?.length) {
		result.accepted = undefined
	}

	if (!result.dismissed?.length) {
		result.dismissed = undefined
	}

	req.apis = result
	return next()
})
