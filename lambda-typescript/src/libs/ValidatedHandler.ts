import type { APIGatewayProxyEvent, APIGatewayProxyResultV2, Handler } from 'aws-lambda'

type ValidatedAPIGatewayProxyEvent<T> = Omit<APIGatewayProxyEvent, keyof T> & T

export type ValidatedHandler<T> = Handler<ValidatedAPIGatewayProxyEvent<T>, APIGatewayProxyResultV2>
