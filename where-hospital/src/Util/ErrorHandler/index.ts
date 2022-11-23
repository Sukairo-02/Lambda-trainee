import { isBoom, Boom } from '@hapi/boom'
import type { ErrorRequestHandler } from 'express'

export = <ErrorRequestHandler>((err, req, res, next) => {
	if (isBoom(err)) {
		return res.status((<Boom>err).output.statusCode).json({ message: (<Boom>err).message })
	}

	console.error(`Error:\n${err}\nRequest:\n${req}`)
	return res.status(500).json({ message: 'Unknown error occured... Try again later' })
})
