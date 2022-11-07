import type { Client } from 'pg'
import type { Customer } from '@dbAdapters/Redistribution/types'

export = (dbClient: Client) => {
	return {
		async get(data: Partial<Customer>[]) {
			await dbClient.connect()

			let dataPrepared: undefined | string
			if (data) {
				dataPrepared = data
					.map(
						(e) =>
							`(${e.login ? `login = ${e.login} ` : ''}${
								e.login && e.password ? `AND password = ${e.password}` : ''
							})`
					)
					.filter((e) => e !== '()')
					.join(' OR ')
			}

			const res = await dbClient.query(
				`
				SELECT * FROM customer
				${dataPrepared ? `WHERE (${dataPrepared})` : ''}`
			)

			await dbClient.end()
			return res.rows[0]
		},

		async insert(data: Customer[]) {
			if (!data.length) return
			await dbClient.connect()
			await dbClient.query(
				`
				INSERT (login, password) INTO customer
				VALUES %L
				ON CONFLICT DO NOTHING`,
				data.map((e) => [e.login, e.password])
			)
			await dbClient.end()
		},

		async update(key: string, data: Partial<Customer>) {
			await dbClient.connect()
			await dbClient.query(
				`
				UPDATE customer
				SET ${data.login ? 'login = $1' : ''}
					${data.password ? 'password = $2' : ''}
				WHERE login = $3`,
				[data.login, data.password, key]
			)
			await dbClient.end()
		},

		async delete(keys: string[]) {
			if (!keys.length) return
			await dbClient.connect()
			await dbClient.query(
				`
				DELETE FROM customer
				WHERE login = ANY($1::text[])`,
				[keys]
			)
			await dbClient.end()
		}
	}
}
