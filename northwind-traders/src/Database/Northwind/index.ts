import { PgConnector } from 'drizzle-orm-pg'
import { Pool } from 'pg'
import config from 'config'
import * as Schema from './schema'

import type { DatabaseConfig } from './types'

const dbConfig = config.get<DatabaseConfig>('Database.HospitalLocation')

const pool = new Pool(dbConfig)
const connector = new PgConnector(pool)

export default {
	Tables: Schema,
	Connector: connector
}
