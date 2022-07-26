import type { RequestHandler } from 'express'
import config from 'config'
const botKey = config.get<string>('telegram.bot')

export = <RequestHandler>((req, res, next) => {
	if (req.headers.authorization?.split(' ')[1] !== botKey) {
		return res.status(401).send('Erorr: unauthorized access!')
	}

	next()
})
