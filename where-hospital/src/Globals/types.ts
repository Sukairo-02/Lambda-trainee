export type ServerConfig = {
	port: number
}

export type StripeConfig = {
	key: string
	jwtSecret: string
	successUrl: string
	failUrl: string
}

export type DatabaseConfig = {
	host: string
	port: number
	database: string
	user: string
	password: string
}
