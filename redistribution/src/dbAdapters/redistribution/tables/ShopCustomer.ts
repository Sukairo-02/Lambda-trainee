import type { Client } from 'pg'
import type { ShopCustomer } from '@dbAdapters/Redistribution/types'

export = (dbClient: Client) => {
	return {
		async insert(data: ShopCustomer[]) {
			await dbClient.connect()
			await dbClient.query('')
			await dbClient.end()
		},

		async update(data: ShopCustomer[]) {
			await dbClient.connect()
			await dbClient.query('')
			await dbClient.end()
		},

		async delete(data: ShopCustomer[]) {
			await dbClient.connect()
			await dbClient.query('')
			await dbClient.end()
		}
	}
}
