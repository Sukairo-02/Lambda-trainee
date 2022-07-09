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

	// if (
	// 	(req.query.periodBegin &&
	// 		!(req.query.periodBegin instanceof String || typeof req.query.periodBegin === 'string')) ||
	// 	(req.query.periodEnd && !(req.query.periodEnd instanceof String || typeof req.query.periodEnd === 'string'))
	// ) {
	// 	return res.status(403).send('Invalid period!')
	// }

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
