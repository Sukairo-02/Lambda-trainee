export type apiResult = {
	symbol: string
	timestamp: string //JSON DATETIME
	coinbasePrice?: number
	coinstatsPrice?: number
	coinpaprikaPrice?: number
	kucoinPrice?: number
	coinmarketcapPrice: number
}[]

export type apiAverage = Partial<{
	result: apiResult
	apis: {
		accepted?: string[]
		dismissed?: string[]
	}
	symbols: {
		accepted?: string[]
		dismissed?: string[]
	}
	warning?: string
}>

export type apiPeriod = Partial<{
	result: apiResult
	apis: {
		accepted?: string[]
		dismissed?: string[]
	}
	symbols: {
		accepted?: string[]
		dismissed?: string[]
	}
}>

export type botDataResponse = Partial<{
	user: string
	favorites?: string
	warning: string
	symbols: {
		accepted?: string[]
		dismissed?: string[]
	}
}>
