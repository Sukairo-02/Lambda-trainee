import schema from './schema'
import type { ValidatedHandler } from '@libs/ValidatedHandler'
import middyfy from '@libs/middyfy'

const helloName = <
	ValidatedHandler<
		typeof schema.body,
		typeof schema.headers,
		typeof schema.pathParameters,
		typeof schema.queryStringParameters
	>
>(async (event) => {
	return { message: `Hello, ${event.body.name}!` }
})

//@ts-ignore - no way to tell TypeScript that this is where function gets those types in the first place
export = middyfy(helloName, schema)
