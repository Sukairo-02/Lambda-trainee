import format from 'pg-format'
import escapeLiteral from '@util/escapeLiteral'
import type { PoolClient } from 'pg'
import type { Shop } from '@dbAdapters/Redistribution/types'

export = (dbClient: PoolClient) => {
	return {
		async get(data?: Partial<Shop>[]) {
			let dataPrepared: undefined | string
			if (data) {
				dataPrepared = data
					.map((e) => {
						const isCalls = Number.isInteger(e.calls) //separate validation for numbers to avoid 0 == false
						const isCallsMax = Number.isInteger(e.callsMax)
						return `(${e.token ? `token = ${escapeLiteral(e.token!)}` : ''}${
							e.token && (isCalls || isCallsMax) ? ' AND ' : ''
						}${isCalls ? `calls = ${e.calls}` : ''}${isCalls && isCallsMax ? ' AND ' : ''}${
							isCallsMax ? `calls_max = ${e.callsMax}` : ''
						})`
					})
					.filter((e) => e !== '()')
					.join(' OR ')
			}

			const query = `
				SELECT * FROM shop
				${dataPrepared ? `WHERE (${dataPrepared})` : ''}`

			const res = (await dbClient.query(query)).rows

			return res as Shop[]
		},

		async insert(data: Shop[]) {
			if (!data.length) return

			const query = format(
				`
				INSERT INTO shop (token, calls, calls_max)
				VALUES %L
				ON CONFLICT DO NOTHING`,
				data.map((e) => [e.token, e.calls, e.callsMax])
			)

			await dbClient.query(query)
		},

		async update(key: string, data: Partial<Shop>) {
			const isCalls = Number.isInteger(data.calls)
			const isCallsMax = Number.isInteger(data.callsMax)

			const query = `
				UPDATE shop
				SET ${data.token ? `token = ${escapeLiteral(data.token)}` : ''}${data.token && (isCalls || isCallsMax) ? ', ' : ''}
					${isCalls ? `calls = ${data.calls}` : ''}${isCalls && isCallsMax ? ', ' : ''}
					${isCallsMax ? `calls_max = ${data.callsMax}` : ''}
				WHERE token = ${escapeLiteral(key)}
				${
					data.token
						? `AND NOT EXISTS (
					SELECT 1 FROM shop WHERE token = ${escapeLiteral(data.token)})`
						: ''
				}
				`

			await dbClient.query(query)
		},

		async delete(keys: string[]) {
			if (!keys.length) return

			const query = `
				DELETE FROM shop
				WHERE token = ANY($1::text[])`

			await dbClient.query(query, [keys])
		}
	}
}
