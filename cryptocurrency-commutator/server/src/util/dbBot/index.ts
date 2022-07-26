import mysql2 from 'mysql2/promise'
import { dbConfig } from './types'

class dbBot {
	private db: mysql2.Connection | undefined
	constructor() {}
	public connect = async (config: dbConfig) => {
		try {
			if (this.db) {
				console.log('Bot database: skipping connection - already connected')
			}
			this.db = await mysql2.createConnection(config)
			console.log('Bot database: connection estabilished')
		} catch (e) {
			console.log(e)
		}
	}

	public disconnect = async () => {
		await this.db?.end()
		this.db = undefined
		console.log('Bot database: connection terminated')
	}

	public init = async () => {
		if (!this.db) {
			throw new Error('Bot database error: you must connect to the database first!')
		}

		try {
			await this.db.query('CREATE TABLE favorites (user VARCHAR(255) NOT NULL, favorite VARCHAR(255) NOT NULL);')
			await this.db.query('CREATE UNIQUE INDEX uq_favorites ON favorites(user, favorite)')
		} catch (e) {
			if ((<mysql2.QueryError>e)?.code === 'ER_TABLE_EXISTS_ERROR') {
				return console.log('Bot database: Table already exists - skipping initialization')
			}
			console.log(e)
		}
	}

	public add = async (
		user: string,
		symbols: string[]
	): Promise<{ result?: { user: string; favorites: string }[]; warning?: string | undefined } | undefined> => {
		if (!this.db) {
			throw new Error('Bot database error: you must connect to the database first!')
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

			await this.db.query('INSERT INTO favorites (user, favorite) VALUES ?', [symbols.map((e) => [user, e])])

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
		}
	}

	public remove = async (user: string, symbols: string[]) => {
		if (!this.db) {
			throw new Error('Bot database error: you must connect to the database first!')
		}

		try {
			if (!user || !symbols.length) {
				return await this.get(user)
			}

			await this.db.query('DELETE FROM favorites WHERE (user, favorite) IN (?)', [symbols.map((e) => [user, e])])
			return await this.get(user)
		} catch (e) {
			console.log(e)
		}
	}

	public get = async (user: string) => {
		if (!this.db) {
			throw new Error('Bot database error: you must connect to the database first!')
		}

		try {
			return (
				await this.db.query(
					'SELECT user, GROUP_CONCAT(favorite SEPARATOR ",") as favorites FROM favorites WHERE user = ? GROUP BY user',
					[user]
				)
			)?.[0]
		} catch (e) {
			console.log(e)
		}
	}
}

const bot = new dbBot()

export = bot
