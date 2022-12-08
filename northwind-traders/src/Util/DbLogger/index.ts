import type { DbOperation } from './types'
import Orm from '@Database/Northwind'

export const dbLogger = async <T extends DbOperation>(dbQuery: T) => {
	const db = await Orm.Connector.connect()
	await db.insert(Orm.Tables.AdminLogs).values({
		query: dbQuery.toSQL().sql
	})

	return dbQuery
}
