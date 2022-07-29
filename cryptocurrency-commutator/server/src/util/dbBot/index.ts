import mysql2 from 'mysql2/promise'
import { dbConfig } from './types'

class dbBot {
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
				console.log('Bot database: skipping connection - already connected')
			}
			this.db = await mysql2.createPool({ ...this.config, debug: false, connectionLimit: 10 })
			console.log('Bot database: connection estabilished')
		} catch (e) {
			console.log(e)
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
				'CREATE TABLE favorites (user VARCHAR(255) NOT NULL, favorite VARCHAR(255) NOT NULL);'
			)
			await connection?.query('CREATE UNIQUE INDEX uq_favorites ON favorites(user, favorite)')
			connection?.release()
		} catch (e) {
			if ((<mysql2.QueryError>e)?.code === 'ER_TABLE_EXISTS_ERROR') {
				return console.log('Bot database: Table already exists - skipping initialization')
			}
			console.log(e)
			this.connection?.release()
		}
	}

	public add = async (
		user: string,
		symbols: string[]
	): Promise<{ result?: { user: string; favorites: string }[]; warning?: string | undefined } | undefined> => {
		if (!this.db) {
			await this.connect()
		}

		try {
			if (!user || !symbols.length) {
				return { result: <
						| [
								{
									user: string
									favorites: string
								}
						  ]
						| undefined
					>await this.get(user) }
			}

			const connection = await this.db?.getConnection()
			this.connection = connection

			await connection?.query('INSERT INTO favorites (user, favorite) VALUES ?', [symbols.map((e) => [user, e])])

			connection?.release()

			return { result: <
					[
						{
							user: string
							favorites: string
						}
					]
				>await this.get(user) }
		} catch (e) {
			if ((<mysql2.QueryError>e)?.code === 'ER_DUP_ENTRY') {
				const usersList = <
					[
						{
							user: string
							favorites: string
						}
					]
				>await this.get(user)

				const accepted: string[] = []
				const rejected: string[] = []

				const usersFav = usersList[0].favorites.split(',')
				symbols.forEach((e) => {
					if (usersFav.find((el) => e === el) ?? false) {
						rejected.push(e)
					} else {
						accepted.push(e)
					}
				})

				console.log(
					`Bot database: Duplicate entry detected: ${user} - ${rejected.join(', ')} - insertion skipped`
				)

				return {
					result: (await this.add(user, accepted))?.result,
					warning: `Duplicate entries detected: ${rejected.join(', ')}.`
				}
			}
			console.log(e)
			this.connection?.release()
		}
	}

	public remove = async (user: string, symbols: string[]) => {
		if (!this.db) {
			await this.connect()
		}

		try {
			if (!user || !symbols.length) {
				return await this.get(user)
			}

			const connection = await this.db?.getConnection()
			this.connection = connection
			await connection?.query('DELETE FROM favorites WHERE (user, favorite) IN (?)', [
				symbols.map((e) => [user, e])
			])
			connection?.release()

			return await this.get(user)
		} catch (e) {
			console.log(e)
			this.connection?.release()
		}
	}

	public get = async (user: string) => {
		if (!this.db) {
			await this.connect()
		}

		try {
			const connection = await this.db?.getConnection()
			this.connection = connection
			const result = (
				await connection?.query(
					'SELECT user, GROUP_CONCAT(favorite SEPARATOR ",") as favorites FROM favorites WHERE user = ? GROUP BY user',
					[user]
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

const bot = new dbBot()

export = bot
