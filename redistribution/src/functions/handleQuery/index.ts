import { eventSchema } from './schema'
import handler from './handler'
import sqsJsonBodyParser from '@middy/sqs-json-body-parser'
import validateEventRecords from '@middleware/validateEventRecords'
import catchSqsErrors from '@middleware/catchSqsErrors'
import middy from '@middy/core'

export = middy(handler).use(sqsJsonBodyParser()).use(validateEventRecords(eventSchema)).use(catchSqsErrors)
