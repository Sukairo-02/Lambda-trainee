import type { Client } from 'pg'
import type { Shop } from '@dbAdapters/Redistribution/types'

export = (dbClient: Client) => {
	return {
		async insert(data: Shop[]) {
			await dbClient.connect()
			await dbClient.query('')
			await dbClient.end()
		},

		async update(data: Shop[]) {
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
