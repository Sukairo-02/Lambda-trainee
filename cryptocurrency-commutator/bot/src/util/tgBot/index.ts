import axios from 'axios'
import express, { Request, Response } from 'express'
import type { Update } from './types'
import queryProcessor from '@util/queryProcessor'

const app = express()
app.use(express.json())

let localToken: string

const botProc = async (req: Request, res: Response) => {
	try {
		const msg: Update = req.body
		if (!msg || !msg.update_id) {
			return res.sendStatus(200)
		}

		let chatID: number | undefined
		let userID: number | undefined
		let messageID: number | undefined
		let rawQuery: string | undefined
		let isQuery = false

		if (msg.message) {
			chatID = msg.message.chat.id
			userID = msg.message.from?.id
			messageID = msg.message.message_id
			rawQuery = msg.message.text
		} else if (msg.callback_query) {
			chatID = msg.callback_query.from.id
			userID = msg.callback_query.from.id
			messageID = msg.callback_query.message?.message_id
			rawQuery = msg.callback_query.data
			isQuery = true
		} else {
			return res.sendStatus(200)
		}

		const query: string[] | undefined = rawQuery?.split(' ')
		if (!query) {
			return res.sendStatus(200)
		}

		if (typeof userID !== 'number' || typeof chatID !== 'number' || typeof messageID !== 'number') {
			return res.sendStatus(200)
		}

		await queryProcessor(localToken, query, userID, chatID, messageID, isQuery)

		return res.sendStatus(200)
	} catch (e) {
		console.log(e, req)
		return res.sendStatus(200)
	}
}

export = async (botToken: string, port: number | string, url: string) => {
	try {
		if (!botToken || !port || !url) {
			throw new Error('Bot error: missing data')
		}

		localToken = botToken

		app.listen(port, () => {
			console.log(`Bot: listening to port ${port}`)
		})

		app.post(`/bot${botToken}`, botProc)

		await axios.post(`https://api.telegram.org/bot${botToken}/setWebhook`, { url: `${url}/bot${botToken}` })
		console.log(`Bot: webhook set to url: ${url}/bot${botToken}`)
	} catch (e) {
		console.log(e)
	}
}
