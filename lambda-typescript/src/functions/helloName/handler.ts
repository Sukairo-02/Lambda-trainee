import envGet from '@util/envGet'
import { TypedEventHandler } from './schema'

export = <TypedEventHandler>(async (event) => {
	return {
		message: `Hello, ${event.body.name}`,
		envMessage: envGet('envMessage').envMessage
	}
})
