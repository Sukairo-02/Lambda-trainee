import type { HasSQL } from './types'
import Orm from '@Database/Northwind'

export const dbLogger = async <T extends HasSQL>(tabUUID: string | undefined, dbQuery: T) => {
	const db = Orm.Connector
	await db.insert(Orm.Tables.AdminLogs).values({
		query: dbQuery.toSQL().sql,
		sender: tabUUID
	})

	return dbQuery
}
