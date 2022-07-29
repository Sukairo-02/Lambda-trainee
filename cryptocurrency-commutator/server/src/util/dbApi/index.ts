import mysql2 from 'mysql2/promise'
import type { cryptoData } from '@util/dataCollector/types'
import type { apis, dbConfig } from './types'

const toSqlDatetime = (date: Date) =>
	new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 19).replace('T', ' ')

class dbApi {
	private db: mysql2.Pool | undefined
	private config: dbConfig | undefined
	private connection: mysql2.PoolConnection | undefined
	constructor() {}

	public setConfig = (config: dbConfig) => {
		this.config = config
	}

	private connect = async () => {
		try {
			if (!this.config) {
				throw new Error('You must set the config first!')
			}

			if (this.db) {
				console.log('Database: skipping connection - already connected')
			}
			this.db = await mysql2.createPool({ ...this.config, debug: false, connectionLimit: 10 })
			console.log('Database: connection estabilished')
		} catch (e) {
			console.log(e)
			this.connection?.release()
		}
	}

	public init = async () => {
		if (!this.db) {
			await this.connect()
		}

		try {
			const connection = await this.db?.getConnection()
			this.connection = connection
			await connection?.query(
				'CREATE TABLE crypto (symbol VARCHAR(10) NOT NULL, timestamp datetime NOT NULL, coinbasePrice DOUBLE, coinstatsPrice DOUBLE, coinpaprikaPrice DOUBLE, kucoinPrice DOUBLE, coinmarketcapPrice DOUBLE);'
			)
			connection?.release()
		} catch (e) {
			if ((<mysql2.QueryError>e)?.code === 'ER_TABLE_EXISTS_ERROR') {
				return console.log('Database: Table already exists - skipping initialization')
			}
			console.log(e)
			this.connection?.release()
		}
	}

	public store = async (cryptoData: cryptoData) => {
		if (!this.db) {
			await this.connect()
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

			const connection = await this.db?.getConnection()
			this.connection = connection
			await connection?.query(
				'INSERT INTO crypto(symbol, timestamp, coinbasePrice, coinstatsPrice, coinpaprikaPrice, kucoinPrice, coinmarketcapPrice) VALUES ?',
				[prepared]
			)
			connection?.release()
		} catch (e) {
			console.log(e)
			this.connection?.release()
		}
	}

	//If no period specified - returns latest data
	public getPeriod = async (
		symbol?: string[] | undefined,
		period?: [Date, Date] | undefined,
		api?: apis[] | undefined
	) => {
		if (!this.db) {
			await this.connect()
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

			const connection = await this.db?.getConnection()
			this.connection = connection
			const result = (
				await connection?.query(
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
			connection?.release()
			return result
		} catch (e) {
			console.log(e)
			this.connection?.release()
		}
	}

	public getAvg = async (
		symbol?: string[] | undefined,
		period?: [Date, Date] | undefined,
		api?: apis[] | undefined
	) => {
		if (!this.db) {
			await this.connect()
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

			const connection = await this.db?.getConnection()
			this.connection = connection
			const result = (
				await connection?.query(
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

			connection?.release()
			return result
		} catch (e) {
			console.log(e)
			this.connection?.release()
		}
	}
}

const db = new dbApi()

export = db
