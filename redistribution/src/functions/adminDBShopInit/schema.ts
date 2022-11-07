import { z } from 'zod'
import type { ValidatedHandler } from '@util/HandlerTypes/ValidatedHandler'

const eventSchema = z.object({
	body: z.object({
		password: z.string()
	})
})

type TypedEventHandler = ValidatedHandler<z.infer<typeof eventSchema>>

export { eventSchema, TypedEventHandler }
