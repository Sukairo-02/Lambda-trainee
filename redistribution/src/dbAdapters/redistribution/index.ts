import envGet from '@util/envGet'
import * as pg from 'pg'
import type { Shop, ShopUser, User } from './types'

class RedistributionDatabase {
	private client: pg.Client | undefined

	public User(dbClient: pg.Client = this.client!) {
		return {
			async insert(data: User) {
				await dbClient.connect()
				await dbClient.query('')
				await dbClient.end()
			},

			async update(data: User) {
				await dbClient.connect()
				await dbClient.query('')
				await dbClient.end()
			},

			async delete(key: string) {
				await dbClient.connect()
				await dbClient.query('')
				await dbClient.end()
			}
		}
	}

	public Shop(dbClient: pg.Client = this.client!) {
		return {
			async insert(data: Shop) {
				await dbClient.connect()
				await dbClient.query('')
				await dbClient.end()
			},

			async update(data: Shop) {
				await dbClient.connect()
				await dbClient.query('')
				await dbClient.end()
			},

			async delete(key: string) {
				await dbClient.connect()
				await dbClient.query('')
				await dbClient.end()
			}
		}
	}

	public ShopUser(dbClient: pg.Client = this.client!) {
		return {
			async insert(data: ShopUser) {
				await dbClient.connect()
				await dbClient.query('')
				await dbClient.end()
			},

			async update(data: ShopUser) {
				await dbClient.connect()
				await dbClient.query('')
				await dbClient.end()
			},

			async delete(data: ShopUser) {
				await dbClient.connect()
				await dbClient.query('')
				await dbClient.end()
			}
		}
	}

	public async init() {
		await this.client!.connect()
		await this.client!.query('')
		await this.client!.end()
	}

	constructor() {
		const { dbHost, dbPort, dbName, dbUsername, dbPassword } = envGet(
			'dbHost',
			'dbPort',
			'dbName',
			'dbUsername',
			'dbPassword'
		)

		this.client = new pg.Client({
			host: dbHost,
			port: +dbPort,
			database: dbName,
			user: dbUsername,
			password: dbPassword
		})

		/*
        Check if tables exist
        init() if don't
         */
	}
}

export = new RedistributionDatabase()
