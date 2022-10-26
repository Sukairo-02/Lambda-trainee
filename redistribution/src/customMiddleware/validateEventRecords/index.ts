import type { MiddlewareObj } from '@middy/core'
import type { SQSEvent, SQSBatchResponse, SQSRecord } from 'aws-lambda'
import type { ZodSchema } from 'zod'

export = (validationSchema?: ZodSchema): MiddlewareObj<SQSEvent, SQSBatchResponse> => {
	return {
		before: async (event) => {
			const FailRecords: SQSRecord[] = []
			const Records: SQSRecord[] = []
			for (const record of event.event.Records) {
				try {
					validationSchema?.parse(record)
					Records.push(record)
				} catch (e) {
					FailRecords.push(record)
				}
			}

			if (FailRecords.length) {
				;(<any>event.event).FailRecords = FailRecords
			}

			if (Records.length) {
				event.event.Records = Records
			} else {
				;(<any>event.event).Records = undefined
			}
		}
	}
}
