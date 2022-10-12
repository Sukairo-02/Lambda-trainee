import schema from './schema'
import type { ValidatedHandler } from '@libs/ValidatedHandler'
import middyfy from '@libs/middyfy'
import * as Boom from '@hapi/boom'
import AWS from 'aws-sdk'

const db = new AWS.DynamoDB.DocumentClient()

const getImages = <
	ValidatedHandler<
		typeof schema.body,
		typeof schema.headers,
		typeof schema.pathParameters,
		typeof schema.queryStringParameters
	>
>(async (event) => {
	const email = event.requestContext?.authorizer?.claims?.email

	if (!email) {
		throw Boom.unauthorized('Missing email in requestContext!')
	}

	const { tableName } = process.env

	if (!tableName) {
		throw Boom.internal('Missing table name!')
	}

	const files =
		(
			await db
				.get({
					TableName: tableName,
					Key: {
						email
					}
				})
				.promise()
		).Item?.files || []

	return { message: `File list:`, files }
})

//@ts-ignore - no way to tell TypeScript that this is where function gets those types in the first place
export = middyfy(getImages, schema)
