import type { RequestHandler } from 'express'
import cryptoList from '@util/lists/cryptoList'

declare global {
	namespace Express {
		interface Request {
			symbols: {
				accepted: string[] | undefined
				dismissed: string[] | undefined
			}
			user: string
		}
	}
}

export = <RequestHandler>((req, res, next) => {
	if (!req.body.user || !(req.body.user instanceof String || typeof req.body.user === 'string')) {
		return res.status(403).send('Invalid user!')
	}

	req.user = req.body.user

	if (
		req.body.symbols &&
		(typeof req.body.symbols !== 'string' || !req.body.symbols.split(',').every((e: any) => typeof e === 'string'))
	) {
		return res.status(403).send('Invalid symbol!')
	}

	const result: {
		accepted: string[] | undefined
		dismissed: string[] | undefined
	} = {
		accepted: [],
		dismissed: []
	}

	;(<string | undefined>req.body.symbols)
		?.split(',')
		.forEach((e) =>
			cryptoList.find((el) => el.symbol === e) ? result.accepted?.push(e) : result.dismissed?.push(e)
		)

	if (req.body.symbols && !result.accepted?.length) {
		return res.status(403).json({ symbols: result })
	}

	if (!result.dismissed?.length) {
		result.dismissed = undefined
	}

	if (!result.accepted?.length) {
		result.accepted = undefined
		return res.status(403).json({ symbols: result })
	}

	req.symbols = result
	return next()
})
