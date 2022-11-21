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

export type Table<dataType, keyType> = {
	get: (data?: Partial<dataType>[]) => Promise<keyType extends string ? dataType[] : (dataType & { id: keyType })[]>
	insert: (data: dataType[]) => Promise<void>
	update: (key: keyType, data: Partial<dataType>) => Promise<void>
	delete: (keys: keyType[]) => Promise<void>
}
