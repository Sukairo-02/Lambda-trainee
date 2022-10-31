export type Shop = {
	token: string
	calls: number
	callsMax: number
}

export type ShopCustomer = {
	shopToken: string
	username: string
	query: string
}

export type Customer = {
	username: string
	password: string
}
