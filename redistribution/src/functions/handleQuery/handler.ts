import { TypedEventHandler } from './schema'
import db from '@dbAdapters/Redistribution'

export = <TypedEventHandler>(async (event) => {
	if (!event.Records) return

	await db.init()

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

	await Promise.all([db.Customer.insert(users), db.ShopCustomer.insert(queries)])
})
