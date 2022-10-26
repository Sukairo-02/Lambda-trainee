type ObjectFromList<T extends ReadonlyArray<string>, V = string> = {
	[K in T extends ReadonlyArray<infer U> ? U : never]: V
}
/**
 * Safely get data from process.env
 *
 * Warning: return's type allows to access any field, however only the ones, names of which were passed, should be used
 */
const envGet = (...vars: ReadonlyArray<string>) => {
	const varsParsed: ObjectFromList<typeof vars> = {}
	for (const e of vars) {
		if (!process.env[e]) {
			throw new Error(`Error: ${e} is missing in process.env`)
		}

		varsParsed[e] = process.env[e]!
	}
	return varsParsed
}

export = envGet
