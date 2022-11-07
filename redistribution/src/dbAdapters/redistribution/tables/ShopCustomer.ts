import type { Client } from 'pg'
import type { ShopCustomer } from '@dbAdapters/Redistribution/types'

export = (dbClient: Client) => {
	return {
		async get(data?: Partial<ShopCustomer>[]) {
			await dbClient.connect()

			let dataPrepared: undefined | string
			if (data) {
				dataPrepared = data
					.map(
						(e) =>
							`${e.shopToken ? `shop_token = ${dbClient.escapeLiteral(e.shopToken)} ` : ''}${
								e.shopToken && (e.customerLogin || e.query) ? 'AND ' : ''
							}${e.customerLogin ? `customer_login = ${e.customerLogin} ` : ''}${
								e.customerLogin && e.query ? `AND query = ${e.query}` : ''
							}`
					)
					.filter((e) => e !== '()')
					.join(' OR ')
			}

			const res = await dbClient.query(`
				SELECT * FROM shop_customer
				${dataPrepared ? `WHERE (${dataPrepared})` : ''}
			`)

			await dbClient.end()
			return res.rows[0] as ShopCustomer[]
		},

		async insert(data: ShopCustomer[]) {
			if (!data.length) return
			await dbClient.connect()
			await dbClient.query(
				`
				INSERT (shop_token, customer_login, query) INTO shop_customer
				VALUES %L
				ON CONFLICT DO NOTHING`,
				data.map((e) => [e.shopToken, e.customerLogin, e.query])
			)
			await dbClient.end()
		},

		async delete(shopTokens?: string[], customerLogins?: string[], queries?: string[]) {
			if (!(shopTokens?.length || customerLogins?.length || queries?.length)) return
			await dbClient.connect()

			await dbClient.query(
				`
				DELETE FROM shop_customer
				WHERE ${
					shopTokens?.length
						? `shop_token IN (${shopTokens.reduce(
								(p, e) => `${p}, ${dbClient.escapeLiteral(e)}`,
								`${dbClient.escapeLiteral(shopTokens.shift()!)}`
						  )})`
						: ''
				}
					${shopTokens?.length && (customerLogins?.length || queries?.length) ? ' AND ' : ''}
					${
						customerLogins?.length
							? `customer_login IN (${customerLogins.reduce(
									(p, e) => `${p}, ${dbClient.escapeLiteral(e)}`,
									`${dbClient.escapeLiteral(customerLogins.shift()!)}`
							  )})`
							: ''
					}
					${
						customerLogins?.length && queries?.length
							? ` AND 
					query IN (${queries.reduce(
						(p, e) => `${p}, ${dbClient.escapeLiteral(e)}`,
						`${dbClient.escapeLiteral(queries.shift()!)}`
					)})`
							: ''
					}`
			)
			await dbClient.end()
		}
	}
}
