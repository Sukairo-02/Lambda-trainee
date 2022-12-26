import type { HasSQL } from './types'
import Orm from '@Database/Northwind'

export const dbLogger =
	(tabUUID: string | undefined) =>
	async <T extends HasSQL>(dbQuery: T) => {
		const db = Orm.Connector
		await db.insert(Orm.Tables.AdminLogs).values({
			query: dbQuery.toSQL().sql,
			sender: tabUUID
		})

		return dbQuery
	}
