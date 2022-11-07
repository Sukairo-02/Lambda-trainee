import { TypedEventHandler } from './schema'
import * as Boom from '@hapi/boom'
import db from '@dbAdapters/Redistribution'

export = <TypedEventHandler>(async (event) => {
	if (event.body.password !== 'VerySecurePasswordSir!') throw Boom.unauthorized('Wrong password')
	await db.init()
	await db.Shop.insert([
		{
			token: 'someshop',
			calls: 0,
			callsMax: 10
		},
		{
			token: 'someshop2',
			calls: 0,
			callsMax: 2
		},
		{
			token: 'someshop3',
			calls: 5,
			callsMax: 7
		}
	])

	return { message: 'Request queued!' }
})
