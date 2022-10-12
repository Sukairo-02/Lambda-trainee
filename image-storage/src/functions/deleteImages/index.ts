import schema from './schema'
import type { ValidatedHandler } from '@libs/ValidatedHandler'
import middyfy from '@libs/middyfy'
import * as Boom from '@hapi/boom'
import AWS from 'aws-sdk'

const storage = new AWS.S3()
const db = new AWS.DynamoDB.DocumentClient()

const deleteImages = <
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

	const { tableName, bucketName } = process.env

	if (!tableName) {
		throw Boom.internal('Missing table name!')
	}

	if (!bucketName) {
		throw Boom.internal('Missing bucket name!')
	}

	const { fileName } = event.body

	const userFiles =
		(
			await db
				.update({
					TableName: tableName,
					Key: {
						email
					},
					ReturnValues: 'ALL_NEW',
					UpdateExpression: 'DELETE #files :fileName',
					ExpressionAttributeNames: {
						'#files': 'files'
					},
					ExpressionAttributeValues: {
						':fileName': db.createSet([fileName])
					}
				})
				.promise()
		).Attributes?.files?.values || []

	await storage.deleteObject({ Bucket: bucketName, Key: `${email}|${fileName}` }).promise()

	return { message: `File list:`, userFiles }
})

//@ts-ignore - no way to tell TypeScript that this is where function gets those types in the first place
export = middyfy(deleteImages, schema)
