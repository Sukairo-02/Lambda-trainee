import { z } from 'zod'
import { ZodType } from 'zod'
import type { Send, NextFunction, Response, Request } from 'express-serve-static-core'

interface TypedResponse<ResBody> extends Express.Response {
	json: Send<ResBody, this>
}

export type TypedHandler<RequestSchema extends ZodType, ResponseType = void> = (
	req: z.infer<RequestSchema> & Omit<Request, keyof z.infer<RequestSchema>>,
	res: TypedResponse<ResponseType> & Omit<Response, keyof TypedResponse<ResponseType>>,
	next: NextFunction
) => any
