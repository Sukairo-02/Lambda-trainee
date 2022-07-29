import axios, { AxiosError, AxiosResponse } from 'axios'
import config from 'config'

import type { InlineKeyboardButton, InlineKeyboardMarkup } from '@util/tgBot/types'
import type { apiResult, apiAverage, apiPeriod, botDataResponse } from './types'

const apiUrl = config.get<string>('api.URL')

const respond = async (token: string, chatID: number, text: string, markup?: InlineKeyboardMarkup) => {
	try {
		await axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
			chat_id: chatID,
			parse_mode: 'HTML',
			text,
			reply_markup: JSON.stringify(markup)
		})
	} catch (e) {
		console.log(e)
	}
}

const invalidCurrencyResponse = async (token: string, chatID: number, symbolList: string[] | undefined) => {
	try {
		if (!symbolList || !symbolList.length) {
			await respond(token, chatID, 'Internal server error. Try again later...')
			throw new Error(`Api error: request rejected, but no invalid symbols specified.`)
		}

		const resMsg = `Invalid currency(-ies): ${symbolList.join(
			', '
		)}.\nRefer to /listrecent to get list of supported currencies.`

		await respond(token, chatID, resMsg)
	} catch (e) {
		console.log(e)
	}
}

const getAvgFromApis = (source: apiResult) => {
	const isPrice = new RegExp(/Price$/)
	return source.reduce<{ symbol: string; price: number; timestamp?: string }[]>((p, e) => {
		let accum = 0
		let amt = 0
		for (const [key, value] of Object.entries(e)) {
			if (isPrice.test(key) && !isNaN(Number(value))) {
				amt++
				accum += Number(value)
			}
		}

		p.push({ symbol: e.symbol, price: accum / amt })
		return p
	}, <{ symbol: string; price: number; timestamp?: string }[]>[])
}

const listToBoard = (list: string[]) => {
	return {
		inline_keyboard: list.reduce<InlineKeyboardButton[][]>((p, e) => {
			p.push([
				{
					text: e,
					callback_data: `/${e}`
				},
				{
					text: '❌',
					callback_data: `/deletefavorite ${e}`
				}
			])
			return p
		}, [])
	}
}

export = async (
	token: string,
	query: string[],
	userID: number,
	chatID: number,
	messageID: number,
	isQuery: boolean
) => {
	try {
		if (!query[0] || query[0][0] !== '/') {
			return
		} //ignore non-command messages

		switch (query[0]) {
			case '/start':
				return await respond(token, chatID, 'Welcome to the world of crypto! Send /help to see your options...')

			case '/help': {
				return await respond(
					token,
					chatID,
					"Here's what you can do:\n/listrecent - Latest data of supported currencies\n/{*currency_name} - Get detailed info about crypto of your choice ex: <code>/BTC</code>\n/addfavorite {*currency_name} - Add crypto to favorites\n/deletefavorite {*currency_name} - Delete crypto from favorites\n/listfavorite - Look at your favorites\n\n<i>* - supports comma-separated list\nex: <code>/addfavorite BTC,ETH,ETC</code></i>"
				)
			}

			case '/listrecent': {
				try {
					const recent = (await axios.get<apiPeriod>(`${apiUrl}/api/period`)).data.result

					if (!recent) {
						throw new Error('Api error: empty response')
					}
					const packed = getAvgFromApis(recent)
					const resMsg = packed.reduce<string>((p, e) => {
						return p + `\n/${e.symbol} - <code>$${e.price}</code>`
					}, 'Here are latest stored values of supported currencies:')

					return await respond(token, chatID, resMsg)
				} catch (e) {
					console.log(e)
					return await respond(token, chatID, 'Data api error. Try again later...')
				}
			}

			case '/addfavorite': {
				if (!query[1]) {
					return await respond(token, chatID, 'You must specify currency!')
				}

				const response = await axios.post<botDataResponse>(
					`${apiUrl}/bot/favorites`,
					{
						user: String(userID),
						symbols: query[1]
					},
					{
						headers: {
							Authorization: `Bearer ${token}`
						}
					}
				)

				let resMsg = `Succesfully added currency(-ies) to favorites!${
					response.data.symbols?.dismissed?.length
						? `\nInvalid currency(-ies) skipped: ${response.data.symbols.dismissed.join(', ')}`
						: ''
				}`

				return await respond(token, chatID, resMsg)
			}

			case '/deletefavorite': {
				if (!query[1]) {
					return await respond(token, chatID, 'You must specify currency!')
				}

				const response = await axios.delete<botDataResponse>(`${apiUrl}/bot/favorites`, {
					headers: {
						Authorization: `Bearer ${token}`
					},
					data: {
						user: String(userID),
						symbols: query[1]
					}
				})

				if (isQuery) {
					if (response.data.favorites?.length) {
						return await axios.post(`https://api.telegram.org/bot${token}/editMessageReplyMarkup`, {
							chat_id: chatID,
							message_id: messageID,
							reply_markup: JSON.stringify(listToBoard(response.data.favorites.split(',')))
						})
					} else {
						return await axios.post(`https://api.telegram.org/bot${token}/deleteMessage`, {
							chat_id: chatID,
							message_id: messageID
						})
					}
				} else {
					let resMsg = `Succesfully deleted currency(-ies) from favorites!${
						response.data.symbols?.dismissed?.length
							? `\nInvalid currency(-ies) skipped: ${response.data.symbols.dismissed.join(', ')}`
							: ''
					}`

					return await respond(token, chatID, resMsg)
				}
			}

			case '/listfavorite': {
				const favorites = await (
					await axios.get<botDataResponse>(`${apiUrl}/bot/favorites?user=${userID}`, {
						headers: {
							Authorization: `Bearer ${token}`
						}
					})
				).data.favorites?.split(',')

				if (!favorites || !favorites.length) {
					return await respond(token, chatID, `Your favorites are currently empty`)
				}

				const keyboard = listToBoard(favorites)

				return await respond(token, chatID, `Here's the list of your favorites:`, keyboard)
			}

			default: {
				const symbols = query[0].substring(1).split(',')
				const nowJSON = new Date().toJSON()
				const JSONDates = [
					new Date(Date.now() - 1800000).toJSON(),
					new Date(Date.now() - 3600000).toJSON(),
					new Date(Date.now() - 10800000).toJSON(),
					new Date(Date.now() - 21600000).toJSON(),
					new Date(Date.now() - 43200000).toJSON(),
					new Date(Date.now() - 86400000).toJSON()
				]
				const timeStrings = ['30m', '1h', '3h', '6h', '12h', '24h']

				for (let i = 0; i < symbols.length; ++i) {
					const symbol = symbols[i]
					try {
						const apiResponse = [
							await axios.get<apiPeriod>(`${apiUrl}/api/period?symbols=${symbol}`),
							await axios.get<apiPeriod>(
								`${apiUrl}/api/average?symbols=${symbol}&periodBegin=${JSONDates[0]}&periodEnd=${nowJSON}`
							),
							await axios.get<apiPeriod>(
								`${apiUrl}/api/average?symbols=${symbol}&periodBegin=${JSONDates[1]}&periodEnd=${nowJSON}`
							),
							await axios.get<apiPeriod>(
								`${apiUrl}/api/average?symbols=${symbol}&periodBegin=${JSONDates[2]}&periodEnd=${nowJSON}`
							),
							await axios.get<apiPeriod>(
								`${apiUrl}/api/average?symbols=${symbol}&periodBegin=${JSONDates[3]}&periodEnd=${nowJSON}`
							),
							await axios.get<apiPeriod>(
								`${apiUrl}/api/average?symbols=${symbol}&periodBegin=${JSONDates[4]}&periodEnd=${nowJSON}`
							),
							await axios.get<apiPeriod>(
								`${apiUrl}/api/average?symbols=${symbol}&periodBegin=${JSONDates[5]}&periodEnd=${nowJSON}`
							)
						]

						if (!apiResponse.every((e) => e.data.result?.length)) {
							await respond(token, chatID, `/${symbol}: no data yet, try again later...`)
						}

						const warning = apiResponse.some((e) => (<any>e).data?.warning)

						const mapped = apiResponse.map((e) => getAvgFromApis(e.data.result!))

						const resMsg = `${mapped.reduce<string>((p, e, i) => {
							return p + `\n\t${timeStrings[i]} - <code>$${e[0].price}</code>`
						}, `/${symbol} - <code>${mapped.shift()![0].price}$</code>\nAverage values:`)}${
							warning ? `\nWarning: missing some data during 24h period, values may be incorrect.` : ''
						}`

						await respond(token, chatID, resMsg)
					} catch (e) {
						if ((<AxiosError<apiAverage & apiPeriod>>e)?.response?.status != 403) {
							console.log(e)
							await respond(token, chatID, `${symbol}: internal server error. Try again later...`)
						}

						const dismissedList = (<AxiosError<apiAverage & apiPeriod>>e)?.response?.data?.symbols
							?.dismissed
						await invalidCurrencyResponse(token, chatID, dismissedList)
					}
				}
				return
			}
		}
	} catch (e) {
		if ((<AxiosError<apiAverage & apiPeriod>>e)?.response?.status != 403) {
			console.log(e)
			return await respond(token, chatID, 'Internal server error. Try again later...')
		}

		const dismissedList = (<AxiosError<apiAverage & apiPeriod>>e)?.response?.data?.symbols?.dismissed
		return await invalidCurrencyResponse(token, chatID, dismissedList)
	}
}
