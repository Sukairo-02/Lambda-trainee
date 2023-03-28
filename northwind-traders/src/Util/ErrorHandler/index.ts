import { isBoom, Boom } from '@hapi/boom'
import util from 'util'
import type { ErrorRequestHandler } from 'express'

export = <ErrorRequestHandler>((err, req, res, next) => {
	if (isBoom(err)) {
		const { data, message } = <Boom>err

		const response = {
			message: message ?? undefined,
			data: data ?? undefined
		}

		return res.status((<Boom>err).output.statusCode).json(response)
	}

	if (err.statusCode && !Number.isNaN(err.statusCode)) {
		return res.status(err.statusCode).json({ message: err.message ?? 'Unknown error occured... Try again later' })
	}

	console.error('Error:\n')
	console.error(err)
	console.error(
		`Path:\n${req.path}\nBody:\n${util.inspect(req.body)}\nParams:\n${util.inspect(
			req.params
		)}\nQuery:\n${util.inspect(req.query)}\n`
	)
	return res.status(500).json({ message: 'Unknown error occured... Try again later' })
})
