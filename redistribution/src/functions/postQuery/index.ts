import { eventSchema } from './schema'
import handler from './handler'
import jsonBodyParser from '@middy/http-json-body-parser'
import validateEvent from '@middleware/validateEvent'
import formatHttpResponse from '@middleware/formatHttpResponse'
import catchHttpErrors from '@middleware/catchHttpErrors'
import middy from '@middy/core'

export = middy(handler)
	.use(jsonBodyParser())
	.use(validateEvent(eventSchema))
	.use(formatHttpResponse)
	.use(catchHttpErrors)

//Updated template example
