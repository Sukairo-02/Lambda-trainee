import type { RequestHandler } from 'express'
import cryptoList from '@util/lists/cryptoList'

declare global {
	namespace Express {
		interface Request {
			symbols: {
				accepted: string[] | undefined
				dismissed: string[] | undefined
			}
		}
	}
}

export = <RequestHandler>((req, res, next) => {
	if (req.query.symbols && !(req.query.symbols instanceof String || typeof req.query.symbols === 'string')) {
		return res.status(403).send('Invalid symbol!')
	}

	const result: {
		accepted: string[] | undefined
		dismissed: string[] | undefined
	} = {
		accepted: [],
		dismissed: []
	}

	;(<string | undefined>req.query.symbols)
		?.split(',')
		.forEach((e) =>
			cryptoList.find((el) => el.symbol === e) ? result.accepted?.push(e) : result.dismissed?.push(e)
		)

	if (req.query.symbols && !result.accepted?.length) {
		return res.status(403).json({ symbols: result })
	}

	if (!result.accepted?.length) {
		result.accepted = undefined
	}

	if (!result.dismissed?.length) {
		result.dismissed = undefined
	}

	req.symbols = result
	return next()
})
