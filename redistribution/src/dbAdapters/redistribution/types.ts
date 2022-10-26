export type Shop = {
	token: string
	calls: number
	callsMax: number
}

export type ShopUser = {
	shopToken: string
	username: string
	query: string
}

export type User = {
	username: string
	password: string
}
