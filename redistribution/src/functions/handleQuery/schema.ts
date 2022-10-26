import { z } from 'zod'
import type { ValidatedRecordsHandler } from '@util/HandlerTypes/ValidatedRecordsHandler'

const eventSchema = z.object({
	body: z.object({
		name: z.string().min(2).max(24)
	})
})

type TypedEventHandler = ValidatedRecordsHandler<z.infer<typeof eventSchema>>

export { eventSchema, TypedEventHandler }
