import type { TypedHandler } from '@Util/TypedHandler'
import { z } from 'zod'

const anySchema = z.any()
type ZodAnySchema = typeof anySchema

export type TypedHandlerContainer = {
	[key: string]: TypedHandler<ZodAnySchema, any>
}
