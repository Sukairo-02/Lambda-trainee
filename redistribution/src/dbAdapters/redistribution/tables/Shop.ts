import type { Client } from 'pg'
import type { Shop } from '@dbAdapters/Redistribution/types'

export = (dbClient: Client) => {
	return {
		async get(data?: Partial<Shop>[]) {
			await dbClient.connect()

			let dataPrepared: undefined | string
			if (data) {
				dataPrepared = data
					.map(
						(e) =>
							`(${e.token ? `token = ${dbClient.escapeLiteral(e.token)} ` : ''}${
								e.token && (e.calls || e.callsMax) ? 'AND ' : ''
							}${e.calls ? `calls = ${e.calls} ` : ''}${
								e.calls && e.callsMax ? `AND calls_max = ${e.callsMax}` : ''
							})`
					)
					.filter((e) => e !== '()')
					.join(' OR ')
			}

			const res = await dbClient.query(
				`
				SELECT * FROM shop
				${dataPrepared ? `WHERE (${dataPrepared})` : ''}`
			)

			await dbClient.end()
			return res.rows[0]
		},

		async insert(data: Shop[]) {
			if (!data.length) return
			await dbClient.connect()
			await dbClient.query(
				`
				INSERT (token, calls, calls_max) INTO shop
				VALUES %L
				ON CONFLICT DO NOTHING`,
				data.map((e) => [e.token, e.calls, e.callsMax])
			)
			await dbClient.end()
		},

		async update(key: string, data: Partial<Shop>) {
			await dbClient.connect()
			await dbClient.query(
				`
				UPDATE shop
				SET ${data.token ? 'token = $1' : ''}
					${data.calls ? 'calls = $2' : ''}
					${data.callsMax ? 'calls_max = $3' : ''}
				WHERE token = $4`,
				[data.token, data.calls, data.callsMax, key]
			)
			await dbClient.end()
		},

		async delete(keys: string[]) {
			if (!keys.length) return
			await dbClient.connect()
			await dbClient.query(
				`
				DELETE FROM shop
				WHERE token = ANY($1::text[])`,
				[keys]
			)
			await dbClient.end()
		}
	}
}
