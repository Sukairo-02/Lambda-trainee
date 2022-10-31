import type { Client } from 'pg'
import type { Customer } from '@dbAdapters/Redistribution/types'

export = (dbClient: Client) => {
	return {
		async insert(data: Customer[]) {
			await dbClient.connect()
			await dbClient.query('')
			await dbClient.end()
		},

		async update(data: Customer[]) {
			await dbClient.connect()
			await dbClient.query('')
			await dbClient.end()
		},

		async delete(key: string[]) {
			await dbClient.connect()
			await dbClient.query('')
			await dbClient.end()
		}
	}
}
