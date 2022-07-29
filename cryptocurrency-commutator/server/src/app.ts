import 'module-alias/register'
import express from 'express'
import config from 'config'
import cron from 'node-cron'

import dbApi from '@util/dbApi'
import dbBot from '@util/dbBot'
import dataCollector from '@util/dataCollector'
import apiRouter from '@routes/api'
import botRouter from '@routes/bot'

import type { ErrorRequestHandler } from 'express'
import type { dbConfig } from '@util/dbApi/types'

const PORT = config.get<number>('server.PORT') || 3000
const app = express()
const dbApiConfig = config.get<dbConfig>('db')
const dbBotConfig = config.get<dbConfig>('dbBot')

app.use(express.json())

app.use('/api', apiRouter)
app.use('/bot', botRouter)

app.use(<ErrorRequestHandler>((err, req, res, next) => {
	console.error(err.stack)
	console.log(`Request:\n${req}\n`)
	return res.status(500).send('Something went wrong...\nTry again later.')
}))

const start = async () => {
	try {
		dbApi.setConfig(dbApiConfig)
		dbBot.setConfig(dbBotConfig)

		await dbApi.init()
		await dbBot.init()

		app.listen(PORT, () => {
			console.log(`Server has been started at port ${PORT}`)
		})
	} catch (e) {
		console.log(e)
	}
}

start()

cron.schedule('0 */5 * * * *', async () => {
	try {
		await dbApi.store(await dataCollector())
	} catch (e) {
		console.log(e)
	}
})
