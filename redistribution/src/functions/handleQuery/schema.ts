import { z } from 'zod'
import type { ValidatedRecordsHandler } from '@util/HandlerTypes/ValidatedRecordsHandler'

const eventSchema = z.object({
	body: z.object({
		username: z.string(),
		password: z.string(),
		shopToken: z.string(),
		query: z.string()
	})
})

type TypedEventHandler = ValidatedRecordsHandler<z.infer<typeof eventSchema>>

export { eventSchema, TypedEventHandler }
