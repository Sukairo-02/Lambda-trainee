export type ServerConfig = {
	port: number
}

export type DatabaseConfig = {
	host: string
	port: number
	database: string
	user: string
	password: string
}

export type SqlQuery = {
	sql: string
	params: unknown[]
}
