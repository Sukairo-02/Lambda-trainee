import format from 'pg-format'

import type { Pool } from 'pg'
import type { Shop } from '@dbAdapters/Redistribution/types'

export = (conPool: Pool) => {
	return {
		async get(data?: Partial<Shop>[]) {
			const dbClient = await conPool.connect()

			try {
				let dataPrepared: undefined | string
				if (data) {
					dataPrepared = data
						.map((e) => {
							const isCalls = Number.isInteger(e.calls) //separate validation for numbers to avoid 0 == false
							const isCallsMax = Number.isInteger(e.callsMax)
							return `(${e.token ? `token = ${dbClient.escapeLiteral(e.token!)}` : ''}${
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

				await dbClient.release()
				return res as Shop[]
			} catch (e) {
				await dbClient.release()
				throw e
			}
		},

		async insert(data: Shop[]) {
			if (!data.length) return
			const dbClient = await conPool.connect()

			try {
				const query = format(
					`
				INSERT INTO shop (token, calls, calls_max)
				VALUES %L
				ON CONFLICT DO NOTHING`,
					data.map((e) => [e.token, e.calls, e.callsMax])
				)

				await dbClient.query(query)
				await dbClient.release()
			} catch (e) {
				await dbClient.release()
				throw e
			}
		},

		async update(key: string, data: Partial<Shop>) {
			const dbClient = await conPool.connect()

			try {
				console.log('Data: ', data)
				const isCalls = Number.isInteger(data.calls)
				const isCallsMax = Number.isInteger(data.callsMax)

				const query = `
				UPDATE shop
				SET ${data.token ? `token = ${dbClient.escapeLiteral(data.token)}` : ''}${
					data.token && (isCalls || isCallsMax) ? ', ' : ''
				}
					${isCalls ? `calls = ${data.calls}` : ''}${isCalls && isCallsMax ? ', ' : ''}
					${isCallsMax ? `calls_max = ${data.callsMax}` : ''}
				WHERE token = ${dbClient.escapeLiteral(key)}`

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
				DELETE FROM shop
				WHERE token = ANY($1::text[])`

				await dbClient.query(query, [keys])
				await dbClient.release()
			} catch (e) {
				await dbClient.release()
				throw e
			}
		}
	}
}
