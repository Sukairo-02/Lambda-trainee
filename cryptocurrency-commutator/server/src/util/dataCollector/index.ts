import axios from 'axios'
import cryptoList from '@util/lists/cryptoList'
import type { tCoinMarketCap, tCoinbase, tCoinStats, tKucoin, tCoinPaprika, cryptoData } from './types'
import type { AxiosResponse, AxiosError } from 'axios'
import config from 'config'

const cmcKey = config.get<string>('apiKeys.coinMarketCap')

axios.interceptors.response.use(
	(response) => {
		return response
	},
	(error) => {
		if (error.response.status === 429) {
			console.log((<AxiosError>error).response?.statusText, (<AxiosError>error).config.url)
			return axios.request(error.config)
		}
		return Promise.reject(error)
	}
)

export = async (): Promise<cryptoData> => {
	const result: cryptoData = {
		timestamp: new Date(),
		data: {}
	}

	const symbols: string[] = []
	const promises: {
		coinbase: Promise<AxiosResponse<tCoinbase>>[]
		coinstats: Promise<AxiosResponse<tCoinStats>>[]
		coinpaprika: Promise<AxiosResponse<tCoinPaprika>> | null
		kucoin: Promise<AxiosResponse<tKucoin>> | null
		coinmarketcap: Promise<AxiosResponse<tCoinMarketCap>> | null
	} = {
		coinbase: [],
		coinstats: [],
		coinpaprika: null,
		kucoin: null,
		coinmarketcap: null
	}

	for (const e of cryptoList) {
		symbols.push(e.symbol)
		promises.coinbase.push(axios.get<tCoinbase>(`https://api.coinbase.com/v2/prices/${e.symbol}-USD/buy`))
		promises.coinstats.push(axios.get<tCoinStats>(`https://api.coinstats.app/public/v1/coins/${e.name}`))
	}

	const symbString = symbols.join()

	promises.coinpaprika = axios.get<tCoinPaprika>(`https://api.coinpaprika.com/v1/tickers`)
	promises.kucoin = axios.get<tKucoin>(`https://api.kucoin.com/api/v1/prices?currencies=${symbString}`)
	promises.coinmarketcap = axios.get<tCoinMarketCap>(
		`https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=${symbString}`,
		{
			headers: {
				'X-CMC_PRO_API_KEY': cmcKey
			}
		}
	)

	symbols.forEach((e) => {
		result.data[e] = {}
	})
	for await (const e of promises.coinbase) {
		try {
			result.data[e.data.data.base].coinbasePrice = Number(e.data.data.amount)
		} catch (er) {
			console.log(`Cause: coinbase`, (<AxiosError>er).response?.status, (<AxiosError>er).response?.config.url)
		}
	}

	for await (const e of promises.coinstats) {
		try {
			result.data[e.data.coin.symbol].coinstatsPrice = e.data.coin.price
		} catch (er) {
			console.log(`Cause: coinstats`, (<AxiosError>er).response?.status, (<AxiosError>er).response?.config.url)
		}
	}

	const coinpaprikaComplete = await promises.coinpaprika
	const kucoinComplete = await promises.kucoin
	const coinmarketcapComplete = await promises.coinmarketcap
	symbols.forEach((e) => {
		result.data[e].coinpaprikaPrice = Number(
			coinpaprikaComplete.data.find((el) => el.symbol === e)?.quotes['USD'].price
		)
		result.data[e].kucoinPrice = Number(kucoinComplete.data.data[e])
		result.data[e].coinmarketcapPrice = Number(coinmarketcapComplete.data.data[e].quote['USD'].price)
	})

	return result
}
