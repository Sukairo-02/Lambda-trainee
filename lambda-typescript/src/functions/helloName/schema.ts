import { z } from 'zod'
import type { ValidatedHandler } from '@util/HandlerTypes/ValidatedHandler'

const eventSchema = z.object({
	body: z.object({
		name: z.string().min(2).max(24)
	})
})

type TypedEventHandler = ValidatedHandler<z.infer<typeof eventSchema>>

export { eventSchema, TypedEventHandler }
