import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import config from 'config'
import { migrate } from 'drizzle-orm/node-postgres/migrator'

import * as Schema from './schema'

import type { DatabaseConfig } from '@Globals/types'

const dbConfig = config.get<DatabaseConfig>('Database.HospitalLocation')
const pool = new Pool(dbConfig)
const database = drizzle(pool)

export default {
	db: database,
	tables: Schema,
	migrate
}
