type tCoinMarketCapQuote = {
	price: number
	volume_24h: number
	volume_change_24h: number
	percent_change_1h: number
	percent_change_24h: number
	percent_change_7d: number
	percent_change_30d?: number | undefined
	market_cap: number
	market_cap_dominance: number
	fully_diluted_market_cap: number
	last_updated: string
}

type tCoinMarketCapStatus = {
	timestamp: string
	error_code: number
	error_message: string
	elapsed: number
	credit_count: number
}

type tCoinMarketCapData = {
	id: number
	name: string
	symbol: string
	slug: string
	is_active?: number
	is_fiat?: number
	cmc_rank: number
	num_market_pairs: number
	circulating_supply: number
	total_supply: number
	max_supply: number | null
	last_updated: string
	date_added: string
	tags: string[]
	platform: {
		id: number
		name: string
		symbol: string
		slug: string
		token_address: string
	} | null
	quote: { [name: string]: tCoinMarketCapQuote }
}

export type tCoinMarketCapLatest = {
	data: tCoinMarketCapData[]
	status: tCoinMarketCapStatus
}

export type tCoinMarketCap = {
	data: { [name: string]: tCoinMarketCapData }
	status: tCoinMarketCapStatus
}

export type tCoinbase = {
	data: {
		base: string
		currency: string
		amount: string
	}
}

type tCoinStatsCoin = {
	id: string
	icon?: string
	name: string
	symbol: string
	rank: number
	price: number
	priceBtc: number
	volume: number
	marketCap: number
	availableSupply: number
	totalSupply: number
	priceChange1h: number
	priceChange1d: number
	priceChange1w: number
	websiteUrl?: string
	redditUrl?: string
	twitterUrl?: string
	exp?: string[]
}

export type tCoinStats = {
	coin: tCoinStatsCoin
}

export type tKucoin = {
	code: string
	data: {
		[symbol: string]: string
	}
}

type tCoinPaprikaQuote = {
	price: number
	volume_24h: number
	volume_24h_change_24h: number
	market_cap: number
	market_cap_change_24h: number
	percent_change_15m: number
	percent_change_30m: number
	percent_change_1h: number
	percent_change_6h: number
	percent_change_12h: number
	percent_change_24h: number
	percent_change_7d: number
	percent_change_30d: number | undefined
	percent_change_1y: number | undefined
	ath_price: number
	ath_date: string
	percent_from_price_ath: number
}

export type tCoinPaprika = [
	{
		id: string
		name: string
		symbol: string
		rank: number
		circulating_supply: number
		total_supply: number
		max_supply?: number | null
		beta_value: number
		first_data_at: string
		last_updated: string
		quotes: {
			[symbol: string]: tCoinPaprikaQuote
		}
	}
]

export type cryptoData = {
	timestamp: Date
	data: {
		[symbol: string]: {
			coinbasePrice?: number
			coinstatsPrice?: number
			coinpaprikaPrice?: number
			kucoinPrice?: number
			coinmarketcapPrice?: number
		}
	}
}
