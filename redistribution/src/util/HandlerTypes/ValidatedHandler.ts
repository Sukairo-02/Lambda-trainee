import type { APIGatewayProxyEvent, APIGatewayProxyResultV2, Handler } from 'aws-lambda'

export type ValidatedEvent<EventType, UpdateWith> = Omit<EventType, keyof UpdateWith> & UpdateWith

export type ValidatedHandler<UpdateWith, EventType = APIGatewayProxyEvent, Returns = APIGatewayProxyResultV2> = Handler<
	ValidatedEvent<EventType, UpdateWith>,
	Returns
>
