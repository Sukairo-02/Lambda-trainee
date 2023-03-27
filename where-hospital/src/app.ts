import express from 'express'
import config from 'config'
import cors from 'cors'

import InfoController from '@Controllers/Info'
import LocalController from '@Controllers/Local'
import NearController from '@Controllers/Near'

import orm from '@Database/HospitalLocation'

import errorHandler from '@Util/errorHandler'

import { ServerConfig } from '@Globals/types'

const app = express()
app.use(cors())
app.use(express.json())

new InfoController(app, '/info')
new LocalController(app, '/local')
new NearController(app, '/near')

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
