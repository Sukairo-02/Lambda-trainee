import type { MiddlewareObj } from '@middy/core'
import type { ValidatedRecordsEvent } from '@util/HandlerTypes/ValidatedRecordsHandler'
import type { SQSEvent } from 'aws-lambda'

export = {
	onError: async (event) => {
		console.error(event.error)
		return event.event.Records //No need to retry records that didn't pass validator
	}
} as MiddlewareObj<ValidatedRecordsEvent<SQSEvent, any>>
