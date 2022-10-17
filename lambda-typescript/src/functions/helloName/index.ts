import { eventSchema, TypedAPIGatewayHandler } from './schema'
import middyfy from '@libs/middyfy'

const handler = <TypedAPIGatewayHandler>(async (event) => {
	return { message: `Hello, ${event.body.name}!` }
})

//@ts-ignore - no way to tell TypeScript that this is where function gets those types in the first place
export = middyfy(handler, eventSchema)
