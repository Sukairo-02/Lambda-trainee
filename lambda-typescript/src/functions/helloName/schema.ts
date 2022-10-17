import { z } from 'zod'
import type { ValidatedHandler } from '@libs/ValidatedHandler'

const eventSchema = z.object({
	body: z.object({
		name: z.string().min(2).max(40)
	})
})

type TypedAPIGatewayHandler = ValidatedHandler<z.infer<typeof eventSchema>>

export { eventSchema, TypedAPIGatewayHandler }
