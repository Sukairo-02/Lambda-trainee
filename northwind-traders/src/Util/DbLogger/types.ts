export type HasSQL = {
	toSQL: () => {
		params: unknown[]
		sql: string
	}
}
