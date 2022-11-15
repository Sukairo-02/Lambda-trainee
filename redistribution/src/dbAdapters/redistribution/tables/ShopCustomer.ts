import format from 'pg-format'

import type { Pool } from 'pg'
import type { ShopCustomer } from '@dbAdapters/Redistribution/types'

export = (conPool: Pool) => {
	return {
		async get(data?: Partial<ShopCustomer>[]) {
			const dbClient = await conPool.connect()

			try {
				let dataPrepared: undefined | string
				if (data) {
					dataPrepared = data
						.map(
							(e) =>
								`(${e.shopToken ? `shop_token = ${dbClient.escapeLiteral(e.shopToken)}` : ''}${
									e.shopToken && (e.customerLogin || e.query) ? ' AND ' : ''
								}${
									e.customerLogin ? `customer_login = ${dbClient.escapeLiteral(e.customerLogin)}` : ''
								}${e.customerLogin && e.query ? ' AND ' : ''}${
									e.query ? `query = ${dbClient.escapeLiteral(e.query)}` : ''
								})`
						)
						.filter((e) => e !== '()')
						.join(' OR ')
				}

				const query = `
				SELECT * FROM shop_customer
				${dataPrepared ? `WHERE (${dataPrepared})` : ''}`

				const res = (await dbClient.query(query)).rows

				await dbClient.release()
				return res as (ShopCustomer & { id: number })[]
			} catch (e) {
				await dbClient.release()
				throw e
			}
		},

		async insert(data: ShopCustomer[]) {
			if (!data.length) return
			const dbClient = await conPool.connect()

			try {
				const query = format(
					`
				INSERT INTO shop_customer (shop_token, customer_login, query)
				SELECT val.shop_token, val.customer_login, val.query FROM (
				VALUES %L
				) val (shop_token, customer_login, query)
				JOIN shop ON shop.token = shop_token
				JOIN customer ON customer.login = customer_login
				WHERE check_shop_calls(shop_token, customer_login, query)`,
					data.map((e) => [e.shopToken, e.customerLogin, e.query])
				)

				await dbClient.query(query)
				await dbClient.release()
			} catch (e) {
				await dbClient.release()
				throw e
			}
		},

		async update(key: number, userQuery: string) {
			const dbClient = await conPool.connect()

			try {
				const query = `
				UPDATE shop_customer
				SET query = $1
				WHERE id = $2`
				await dbClient.query(query, [userQuery, key])
				await dbClient.release()
			} catch (e) {
				await dbClient.release()
				throw e
			}
		},

		async delete(keys: number[]) {
			if (!keys.length) return
			const dbClient = await conPool.connect()

			try {
				const query = `
				DELETE FROM shop_customer
				WHERE keys = ANY($1::int[])`

				await dbClient.query(query, [keys])
				await dbClient.release()
			} catch (e) {
				await dbClient.release()
				throw e
			}
		}
	}
}
