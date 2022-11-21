import format from 'pg-format'
import escapeLiteral from '@util/escapeLiteral'
import type { PoolClient } from 'pg'
import type { Customer } from '@dbAdapters/Redistribution/types'

export = (dbClient: PoolClient) => {
	return {
		async get(data?: Partial<Customer>[]) {
			let dataPrepared: undefined | string
			if (data) {
				dataPrepared = data
					.map(
						(e) =>
							`(${e.login ? `login = ${escapeLiteral(e.login)}` : ''}${
								e.login && e.password ? ' AND ' : ''
							}${e.password ? `password = ${escapeLiteral(e.password)}` : ''})`
					)
					.filter((e) => e !== '()')
					.join(' OR ')
			}

			const query = `
				SELECT * FROM customer
				${dataPrepared ? `WHERE (${dataPrepared})` : ''}`

			const res = (await dbClient.query(query)).rows

			return res as Customer[]
		},

		async insert(data: Customer[]) {
			if (!data.length) return

			const query = format(
				`
				INSERT INTO customer (login, password)
				VALUES %L
				ON CONFLICT DO NOTHING`,
				data.map((e) => [e.login, e.password])
			)

			await dbClient.query(query)
		},

		async update(key: string, data: Partial<Customer>) {
			const query = `
				UPDATE customer
				SET ${data.login ? `login = ${escapeLiteral(data.login)}` : ''}${data.login && data.password ? ', ' : ''}
					${data.password ? `password = ${escapeLiteral(data.password)}` : ''}
				WHERE login = ${escapeLiteral(key)}
				${
					data.login
						? `AND NOT EXISTS (
					SELECT 1 FROM customer WHERE login = ${escapeLiteral(data.login)})`
						: ''
				}`

			await dbClient.query(query)
		},

		async delete(keys: string[]) {
			if (!keys.length) return

			const query = `
				DELETE FROM customer
				WHERE login = ANY($1::text[])`

			await dbClient.query(query, [keys])
		}
	}
}
