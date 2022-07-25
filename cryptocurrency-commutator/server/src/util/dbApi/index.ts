import mysql2 from 'mysql2/promise'
import type { cryptoData } from '@util/dataCollector/types'
import type { apis, dbConfig } from './types'

const toSqlDatetime = (date: Date) =>
	new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 19).replace('T', ' ')

class dbApi {
	private db: mysql2.Connection | undefined
	constructor() {}
	public connect = async (config: dbConfig) => {
		try {
			if (this.db) {
				console.log('Database: skipping connection - already connected')
			}
			this.db = await mysql2.createConnection(config)
			console.log('Database: connection estabilished')
		} catch (e) {
			console.log(e)
		}
	}

	public disconnect = async () => {
		await this.db?.end()
		this.db = undefined
		console.log('Database: connection terminated')
	}

	public init = async () => {
		if (!this.db) {
			throw new Error('Database error: you must connect to the database first!')
		}

		try {
			await this.db.query(
				'CREATE TABLE crypto (symbol VARCHAR(10) NOT NULL, timestamp datetime NOT NULL, coinbasePrice DOUBLE, coinstatsPrice DOUBLE, coinpaprikaPrice DOUBLE, kucoinPrice DOUBLE, coinmarketcapPrice DOUBLE);'
			)
		} catch (e) {
			if ((<mysql2.QueryError>e)?.code === 'ER_TABLE_EXISTS_ERROR') {
				return console.log('Database: Table already exists - skipping initialization')
			}
			console.log(e)
		}
	}

	public describe = async () => {
		if (!this.db) {
			throw new Error('Database error: you must connect to the database first!')
		}

		try {
			console.log((await this.db.query('DESCRIBE crypto;'))[0])
		} catch (e) {
			console.log(e)
		}
	}

	public store = async (cryptoData: cryptoData) => {
		if (!this.db) {
			throw new Error('Database error: you must connect to the database first!')
		}

		try {
			const prepared = []
			const formatTimestamp = toSqlDatetime(cryptoData.timestamp)
			for (let [key, value] of Object.entries(cryptoData.data)) {
				prepared.push([
					key,
					formatTimestamp,
					value.coinbasePrice ?? null,
					value.coinstatsPrice ?? null,
					value.coinpaprikaPrice ?? null,
					value.kucoinPrice ?? null,
					value.coinmarketcapPrice ?? null
				])
			}

			await this.db.query(
				'INSERT INTO crypto(symbol, timestamp, coinbasePrice, coinstatsPrice, coinpaprikaPrice, kucoinPrice, coinmarketcapPrice) VALUES ?',
				[prepared]
			)
		} catch (e) {
			console.log(e)
		}
	}

	//If no period specified - returns latest data
	public getPeriod = async (
		symbol?: string[] | undefined,
		period?: [Date, Date] | undefined,
		api?: apis[] | undefined
	) => {
		if (!this.db) {
			throw new Error('Database error: you must connect to the database first!')
		}

		try {
			symbol = symbol ? JSON.parse(JSON.stringify(symbol)) : undefined
			period = period ? [period[0], period[1]] : undefined
			api = api ? JSON.parse(JSON.stringify(api)) : undefined

			if (period && period[1].getTime() < period[0].getTime()) {
				const tmp = period[0]
				period[0] = period[1]
				period[1] = tmp
			}

			if (symbol?.length == 0) {
				symbol = undefined
			}

			if (api?.length == 0) {
				api = undefined
			}

			return (
				await this.db.query(
					`SELECT ${
						api
							? `symbol, timestamp, ${api.shift()}Price${api.reduce(
									(p, e) => `${p}${`, ${e}Price as ${e}Price`}`,
									''
							  )}`
							: '*'
					} FROM crypto WHERE ${
						symbol
							? `(symbol = ${mysql2.escape(symbol.shift())}${symbol.reduce(
									(p, e) => `${p} OR symbol = ${mysql2.escape(e)}`,
									''
							  )}) AND `
							: ''
					} timestamp ${
						period
							? `BETWEEN '${toSqlDatetime(period[0])}' AND '${toSqlDatetime(period[1])}'`
							: '= (SELECT MAX(timestamp) FROM crypto)'
					}`
				)
			)?.[0]
		} catch (e) {
			console.log(e)
		}
	}

	public getAvg = async (
		symbol?: string[] | undefined,
		period?: [Date, Date] | undefined,
		api?: apis[] | undefined
	) => {
		if (!this.db) {
			throw new Error('Database error: you must connect to the database first!')
		}

		try {
			symbol = symbol ? JSON.parse(JSON.stringify(symbol)) : undefined
			period = period ? [period[0], period[1]] : undefined
			api = api ? JSON.parse(JSON.stringify(api)) : undefined

			if (period && period[1].getTime() < period[0].getTime()) {
				const tmp = period[0]
				period[0] = period[1]
				period[1] = tmp
			}

			if (symbol?.length == 0) {
				symbol = undefined
			}

			if (api?.length == 0) {
				api = undefined
			}

			const apiFirst = api?.[0]

			return (
				await this.db.query(
					`SELECT symbol, ${
						api
							? `AVG(${apiFirst}Price) as ${api.shift()}Price ${api.reduce(
									(p, e) => `${p}${`, AVG(${e}Price) as ${e}Price`}`,
									''
							  )}`
							: 'AVG(coinbasePrice) as coinbasePrice, AVG(coinstatsPrice) as coinstatsPrice, AVG(coinpaprikaPrice) as coinpaprikaPrice, AVG(kucoinPrice) as kucoinPrice, AVG(coinmarketcapPrice) as coinmarketcapPrice'
					} FROM crypto ${symbol ?? period ? 'WHERE' : ''} ${
						symbol
							? `(symbol = ${mysql2.escape(symbol.shift())}${symbol.reduce(
									(p, e) => `${p} OR symbol = ${mysql2.escape(e)}`,
									''
							  )})`
							: ''
					} ${(symbol ?? false) && period ? ' AND' : ''} ${
						period
							? `timestamp BETWEEN '${toSqlDatetime(period[0])}' AND '${toSqlDatetime(period[1])}' `
							: ''
					} GROUP BY symbol;`
				)
			)?.[0]
		} catch (e) {
			console.log(e)
		}
	}
}

const db = new dbApi()

export = db
