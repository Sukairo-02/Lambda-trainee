import format from 'pg-format'
import escapeLiteral from '@util/escapeLiteral'
import type { PoolClient } from 'pg'
import type { ShopCustomer } from '@dbAdapters/Redistribution/types'

export = (dbClient: PoolClient) => {
	return {
		async get(data?: Partial<ShopCustomer>[]) {
			let dataPrepared: undefined | string
			if (data) {
				dataPrepared = data
					.map(
						(e) =>
							`(${e.shopToken ? `shop_token = ${escapeLiteral(e.shopToken)}` : ''}${
								e.shopToken && (e.customerLogin || e.query) ? ' AND ' : ''
							}${e.customerLogin ? `customer_login = ${escapeLiteral(e.customerLogin)}` : ''}${
								e.customerLogin && e.query ? ' AND ' : ''
							}${e.query ? `query = ${escapeLiteral(e.query)}` : ''})`
					)
					.filter((e) => e !== '()')
					.join(' OR ')
			}

			const query = `
				SELECT * FROM shop_customer
				${dataPrepared ? `WHERE (${dataPrepared})` : ''}`

			const res = (await dbClient.query(query)).rows

			return res as (ShopCustomer & { id: number })[]
		},

		async insert(data: ShopCustomer[]) {
			if (!data.length) return

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
		},

		async update(key: number, userQuery: string) {
			const query = `
				UPDATE shop_customer
				SET query = $1
				WHERE id = $2`

			await dbClient.query(query, [userQuery, key])
		},

		async delete(keys: number[]) {
			if (!keys.length) return

			const query = `
				DELETE FROM shop_customer
				WHERE keys = ANY($1::int[])`

			await dbClient.query(query, [keys])
		}
	}
}
