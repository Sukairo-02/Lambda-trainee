import { RequestHandler } from 'express'
import Orm from '@Database/Northwind'
import { eq } from 'drizzle-orm/expressions'

const db = Orm.Connector
const { AdminLogs } = Orm.Tables

class Dashboard {
	public Requests = <RequestHandler>(async (req, res, next) => {
		try {
			const requests = await db.select(AdminLogs).where(eq(AdminLogs.sender, req.headers['tab-uuid'] as string))

			return res.json(requests)
		} catch (e) {
			next(e)
		}
	})
}

export = new Dashboard()
