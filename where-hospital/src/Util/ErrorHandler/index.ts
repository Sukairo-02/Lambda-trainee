import { isBoom, Boom } from '@hapi/boom'
import util from 'util'
import type { ErrorRequestHandler } from 'express'

export = <ErrorRequestHandler>((err, req, res, next) => {
	if (isBoom(err)) {
		return res.status((<Boom>err).output.statusCode).json({ message: (<Boom>err).message })
	}

	console.error('Error:\n')
	console.error(err)
	console.error(
		`Path:\n${req.path}\nBody:\n${util.inspect(req.body)}\nParams:\n${util.inspect(
			req.params
		)}\nQuery:\n${util.inspect(req.query)}\n`
	)
	return res.status(500).json({ error: 'Unknown error occured... Try again later' })
})
