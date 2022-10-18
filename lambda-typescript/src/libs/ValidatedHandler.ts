import type { APIGatewayProxyEvent, APIGatewayProxyResultV2, Handler } from 'aws-lambda'

type ValidatedEventHandler<EventType, UpdateWith> = Omit<EventType, keyof UpdateWith> & UpdateWith

export type ValidatedHandler<UpdateWith, EventType = APIGatewayProxyEvent, Returns = APIGatewayProxyResultV2> = Handler<
	ValidatedEventHandler<EventType, UpdateWith>,
	Returns
>
