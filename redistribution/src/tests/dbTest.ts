;(process.env.dbHost = 'localhost'), (process.env.dbPort = '5432'), (process.env.dbName = 'redistribution')
process.env.dbUsername = 'RedistributionClient'
process.env.dbPassword = 'RedistributionClientSomePassword'
//Replace prod db info with local instance

import 'module-alias/register'
import db from '@dbAdapters/Redistribution'

//Sanbox for testing out adapter before deployment
const start = async () => {
	try {
		await db.init()

		// await db.Shop.insert([
		// 	{
		// 		token: 'token1',
		// 		calls: 0,
		// 		callsMax: 5
		// 	},
		// 	{
		// 		token: 'token2',
		// 		calls: 0,
		// 		callsMax: 5
		// 	},
		// 	{
		// 		token: 'token3',
		// 		calls: 3,
		// 		callsMax: 3
		// 	},
		// 	{
		// 		token: 'token4',
		// 		calls: 4,
		// 		callsMax: 5
		// 	},
		// 	{
		// 		token: 'token5',
		// 		calls: 7,
		// 		callsMax: 5
		// 	}
		// ])
		// console.table(await db.Shop.get())

		// await db.Customer.insert([
		// 	{
		// 		login: 'cus1',
		// 		password: 'cus1p'
		// 	},
		// 	{
		// 		login: 'cus2',
		// 		password: 'cus2p'
		// 	},
		// 	{
		// 		login: 'cus3',
		// 		password: 'cus3p'
		// 	},
		// 	{
		// 		login: 'cus4',
		// 		password: 'cus4p'
		// 	},
		// 	{
		// 		login: 'cus5',
		// 		password: 'cus5p'
		// 	}
		// ])
		// console.table(await db.Customer.get())

		// await db.ShopCustomer.insert([
		// 	{
		// 		shopToken: 'invalid',
		// 		customerLogin: 'cus1',
		// 		query: 'invalidcus1'
		// 	},
		// 	{
		// 		shopToken: 'invalid',
		// 		customerLogin: 'invalid',
		// 		query: 'invalidinvalid'
		// 	},
		// 	{
		// 		shopToken: 'token1',
		// 		customerLogin: 'invalid',
		// 		query: 'token1invalid'
		// 	},
		// 	{
		// 		shopToken: 'token1',
		// 		customerLogin: 'cus1',
		// 		query: 't1c1'
		// 	},
		// 	{
		// 		shopToken: 'token2',
		// 		customerLogin: 'cus1',
		// 		query: 't2c1'
		// 	},
		// 	{
		// 		shopToken: 'token2',
		// 		customerLogin: 'cus1',
		// 		query: 't2c1'
		// 	},
		// 	{
		// 		shopToken: 'token3',
		// 		customerLogin: 'cus4',
		// 		query: 't3c4'
		// 	},
		// 	{
		// 		shopToken: 'token4',
		// 		customerLogin: 'cus5',
		// 		query: 't4c5'
		// 	},
		// 	{
		// 		shopToken: 'token1',
		// 		customerLogin: 'cus3',
		// 		query: 't1c3'
		// 	},
		// 	{
		// 		shopToken: 'token2',
		// 		customerLogin: 'cus4',
		// 		query: 't2c4'
		// 	},
		// 	{
		// 		shopToken: 'token4',
		// 		customerLogin: 'cus1',
		// 		query: 't4c1'
		// 	}
		// ])
		// console.table(await db.ShopCustomer.get())

		// await db.Shop.update('token3', { calls: 0 })
		// await db.Shop.update('token4', { callsMax: 6 })
		// await db.Shop.update('token5', { token: 'token5N', calls: 6, callsMax: 8 })

		// await db.Customer.update('cus1', { login: 'cus1N' })
		// await db.Customer.update('cus2', { password: 'cus2pN' })
		// await db.Customer.update('cus3', { login: 'cus3N', password: 'cus3pN' })
		// await db.Shop.delete(['token2', 'token4', 'nottoken'])
		// console.table(
		// 	await db.ShopCustomer.get([
		// 		{ shopToken: 'token1' },
		// 		{ customerLogin: 'cus3N' },
		// 		{ shopToken: 'invalid', customerLogin: 'cus3N' },
		// 		{ shopToken: 'token1', customerLogin: 'invalid' },
		// 		{},
		// 		{ shopToken: 'token1', query: 't1c1' },
		// 		{}
		// 	])
		// )
		// await db.ShopCustomer.update(3, 't1c1N')
		// console.table(await db.ShopCustomer.get())
	} catch (e) {
		console.error(e)
	}
}

Promise.resolve(start())
