import format from 'pg-format'

import type { Pool } from 'pg'
import type { Customer } from '@dbAdapters/Redistribution/types'

export = (conPool: Pool) => {
	return {
		async get(data?: Partial<Customer>[]) {
			const dbClient = await conPool.connect()

			try {
				let dataPrepared: undefined | string
				if (data) {
					dataPrepared = data
						.map(
							(e) =>
								`(${e.login ? `login = ${dbClient.escapeLiteral(e.login)}` : ''}${
									e.login && e.password ? ' AND ' : ''
								}${e.password ? `password = ${dbClient.escapeLiteral(e.password)}` : ''})`
						)
						.filter((e) => e !== '()')
						.join(' OR ')
				}

				const query = `
				SELECT * FROM customer
				${dataPrepared ? `WHERE (${dataPrepared})` : ''}`

				const res = (await dbClient.query(query)).rows

				await dbClient.release()
				return res as Customer[]
			} catch (e) {
				await dbClient.release()
				throw e
			}
		},

		async insert(data: Customer[]) {
			if (!data.length) return
			const dbClient = await conPool.connect()

			try {
				const query = format(
					`
				INSERT INTO customer (login, password)
				VALUES %L
				ON CONFLICT DO NOTHING`,
					data.map((e) => [e.login, e.password])
				)

				await dbClient.query(query)
				await dbClient.release()
			} catch (e) {
				await dbClient.release()
				throw e
			}
		},

		async update(key: string, data: Partial<Customer>) {
			const dbClient = await conPool.connect()

			try {
				const query = `
				UPDATE customer
				SET ${data.login ? `login = ${dbClient.escapeLiteral(data.login)}` : ''}${data.login && data.password ? ', ' : ''}
					${data.password ? `password = ${dbClient.escapeLiteral(data.password)}` : ''}
				WHERE login = ${dbClient.escapeLiteral(key)}`

				await dbClient.query(query)
				await dbClient.release()
			} catch (e) {
				await dbClient.release()
				throw e
			}
		},

		async delete(keys: string[]) {
			if (!keys.length) return
			const dbClient = await conPool.connect()

			try {
				const query = `
				DELETE FROM customer
				WHERE login = ANY($1::text[])`

				await dbClient.query(query, [keys])
				await dbClient.release()
			} catch (e) {
				await dbClient.release()
				throw e
			}
		}
	}
}
