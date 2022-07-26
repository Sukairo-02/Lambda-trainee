//Popular crypto list can be determined by code via some of the apis, but will change overtime, causing inconsistency in data
//Additionally, apis require different data for requests (id - coinpaprika/name - coinstats/symbol - rest of them)
//This data has to be checked manually because it varies on apis
//Thus, hardcoded currency list is prefered here
//Coins for list were selected via CoinMarketCap
/*FAILED COINS: XRP LEO BNB TRX - coinbase /// LEO BUSD - kucoin */
export = [
	{
		symbol: 'BTC',
		name: 'bitcoin',
		id: 'btc-bitcoin'
	},
	{
		symbol: 'ETH',
		name: 'ethereum',
		id: 'eth-ethereum'
	},
	{
		symbol: 'USDT',
		name: 'tether',
		id: 'usdt-tether'
	},
	{
		symbol: 'USDC',
		name: 'usd-coin',
		id: 'usdc-usd-coin'
	},
	{
		symbol: 'ADA',
		name: 'cardano',
		id: 'ada-cardano'
	},
	{
		symbol: 'SOL',
		name: 'solana',
		id: 'sol-solana'
	},
	{
		symbol: 'DOGE',
		name: 'dogecoin',
		id: 'doge-dogecoin'
	},
	{
		symbol: 'DOT',
		name: 'polkadot',
		id: 'dot-polkadot'
	},
	{
		symbol: 'DAI',
		name: 'dai',
		id: 'dai-dai'
	},
	{
		symbol: 'SHIB',
		name: 'shiba-inu',
		id: 'shib-shiba-inu'
	},
	{
		symbol: 'WBTC',
		name: 'wrapped-bitcoin',
		id: 'wbtc-wrapped-bitcoin'
	},
	{
		symbol: 'AVAX',
		name: 'avalanche-2',
		id: 'avax-avalanche'
	},
	{
		symbol: 'MATIC',
		name: 'matic-network',
		id: 'matic-polygon'
	},
	{
		symbol: 'UNI',
		name: 'uniswap',
		id: 'uni-uniswap'
	},
	{
		symbol: 'LTC',
		name: 'litecoin',
		id: 'ltc-litecoin'
	},
	{
		symbol: 'LINK',
		name: 'chainlink',
		id: 'link-chainlink'
	},
	{
		symbol: 'XLM',
		name: 'stellar',
		id: 'xlm-stellar'
	},
	{
		symbol: 'ATOM',
		name: 'cosmos',
		id: 'atom-cosmos'
	},
	{
		symbol: 'ALGO',
		name: 'algorand',
		id: 'algo-algorand'
	},
	{
		symbol: 'ETC',
		name: 'ethereum-classic',
		id: 'etc-ethereum-classic'
	}
]
