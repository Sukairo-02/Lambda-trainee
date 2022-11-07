export type Shop = {
	token: string
	calls: number
	callsMax: number
}

export type ShopCustomer = {
	shopToken: string
	customerLogin: string
	query: string
}

export type Customer = {
	login: string
	password: string
}
