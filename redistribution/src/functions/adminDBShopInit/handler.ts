import { TypedEventHandler } from './schema'
import * as Boom from '@hapi/boom'
import dbPool from '@dbAdapters/Redistribution'

export = <TypedEventHandler>(async (event) => {
	if (event.body.password !== 'VerySecurePasswordSir!') throw Boom.unauthorized('Wrong password')

	const db = await dbPool.init()
	let error: any
	try {
		await db.Shop.insert([
			{
				token: 'someshop',
				calls: 0,
				callsMax: 3000
			},
			{
				token: 'someshop2',
				calls: 0,
				callsMax: 2450
			},
			{
				token: 'someshop3',
				calls: 0,
				callsMax: 3500
			},
			{
				token: 'someshop4',
				calls: 0,
				callsMax: 4000
			},
			{
				token: 'someshop5',
				calls: 0,
				callsMax: 3450
			}
		])
	} catch (e) {
		error = e
	} finally {
		await db.end()
		if (error) throw error
	}

	return { message: 'Database initialized!' }
})
