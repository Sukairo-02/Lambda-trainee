import type { RequestHandler } from 'express'

declare global {
	namespace Express {
		interface Request {
			period?: [Date, Date]
		}
	}
}

export = <RequestHandler>((req, res, next) => {
	if (!req.query.periodBegin) {
		req.period = undefined
		return next()
	}

	const validated: [Date, Date] = [
		new Date(<string>req.query.periodBegin),
		new Date(<string>req.query.periodEnd || new Date())
	]

	if (isNaN(validated[0].getTime()) || isNaN(validated[1].getTime())) {
		return res.status(403).send('Invalid period!')
	}

	req.period = validated
	return next()
})
