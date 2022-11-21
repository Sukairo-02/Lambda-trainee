import { TypedEventHandler } from './schema'
import dbPool from '@dbAdapters/Redistribution'

export = <TypedEventHandler>(async (event) => {
	if (!event.Records) return

	const users = event.Records.map((e) => {
		return {
			login: e.body.username,
			password: e.body.password
		}
	})

	const queries = event.Records.map((e) => {
		return {
			shopToken: e.body.shopToken,
			customerLogin: e.body.username,
			query: e.body.query
		}
	})

	const db = await dbPool.init()
	let error: any
	try {
		await db.Customer.insert(users)
		await db.ShopCustomer.insert(queries)
	} catch (e) {
		error = e
	} finally {
		await db.end()
		if (error) throw error
	}
})
