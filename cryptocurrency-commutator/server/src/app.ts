import 'module-alias/register'
import express from 'express'
import config from 'config'
import cron from 'node-cron'

import db from '@util/dbApi'
import dataCollector from '@util/dataCollector'
import apiRouter from '@routes/api'

import type { ErrorRequestHandler } from 'express'
import type { dbConfig } from '@util/dbApi/types'

const PORT = config.get<number>('server.PORT') || 3000
const app = express()
const dbConfig = config.get<dbConfig>('db')

app.use(express.json())

app.use('/api', apiRouter)

app.use(<ErrorRequestHandler>((err, req, res, next) => {
	console.error(err.stack)
	console.log(`Request:\n${req}\n`)
	return res.status(500).send('Something went wrong...\nTry again later.')
}))

const start = async () => {
	try {
		await db.connect(dbConfig)
		await db.init()
		app.listen(PORT, () => {
			console.log(`Server has been started at port ${PORT}`)
		})
	} catch (e) {
		console.log(e)
	} finally {
		await db.disconnect()
	}
}

start()

cron.schedule('0 */5 * * * *', async () => {
	try {
		await db.connect(dbConfig) //Finally triggers before program exits, have to reopen db connection on use
		await db.store(await dataCollector())
		await db.disconnect()
	} catch (e) {
		console.log(e)
	}
})

//TO-DO
//patch db adapter for arrays - DONE
//implement period logic - DONE
//hook db to REST - DONE
//bot's db
//REST for bot's db
//patch old cryptobot for new architecture
