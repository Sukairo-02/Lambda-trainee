import config from 'config'
import cors from 'cors'
import express from 'express'

import GetDataController from '@Controllers/GetData'
import SearchController from '@Controllers/Search'

import orm from '@Database/Northwind'

import errorHandler from '@Util/errorHandler'

import type { ServerConfig } from '@Globals/types'

const app = express()
app.use(cors())
app.use(express.json())

new GetDataController(app, '/getData')
new SearchController(app, '/search')

app.use(errorHandler)

const serverConfig = config.get<ServerConfig>('Server')

const port = process.env.PORT || serverConfig.port

async function start() {
	try {
		await orm.migrate(orm.db, {
			migrationsFolder: './db-generated'
		})
		app.listen(port, () => console.log(`Server started on port ${port}`))
	} catch (e) {
		console.error(e)
	}
}

start()
