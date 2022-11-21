import { TypedEventHandler } from './schema'
import * as Boom from '@hapi/boom'
import dbPool from '@dbAdapters/Redistribution'

export = <TypedEventHandler>(async (event) => {
	if (event.body.password !== 'VerySecurePasswordSir!') throw Boom.unauthorized('Wrong password')

	let error: any
	let dbData: any

	const db = await dbPool.init()

	try {
		dbData = {
			Shop: await db.Shop.get(),
			Customer: await db.Customer.get(),
			ShopCustomer: await db.ShopCustomer.get()
		}
	} catch (e) {
		error = e
	} finally {
		await db.end()
		if (error) throw error
	}

	return { message: dbData }
})
