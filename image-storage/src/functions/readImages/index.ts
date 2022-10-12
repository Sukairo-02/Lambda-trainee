import schema from './schema'
import type { ValidatedHandler } from '@libs/ValidatedHandler'
import middyfy from '@libs/middyfy'
import * as Boom from '@hapi/boom'
import AWS from 'aws-sdk'

const storage = new AWS.S3()
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

	const { tableName, bucketName } = process.env

	if (!tableName) {
		throw Boom.internal('Missing table name!')
	}

	if (!bucketName) {
		throw Boom.internal('Missing bucket name!')
	}

	let userFiles =
		(
			await db
				.get({
					TableName: tableName,
					Key: {
						email
					}
				})
				.promise()
		).Item?.files?.values || []
	const images = event.body?.images //to get only specified list of files
	if (images) {
		if (!Array.isArray(images)) {
			throw Boom.badData('Query param "files" must be JSON-encoded list of strings!')
		}

		userFiles = images.filter((e) => userFiles.find((el) => el === e))
	}

	const promises: Promise<string>[] = []
	for (const e of userFiles) {
		promises.push(
			storage.getSignedUrlPromise('getObject', {
				Bucket: bucketName,
				Key: `${email}|${e}`,
				Expires: 300
			})
		)
	}

	const links: string[] = []
	for (const e of promises) {
		links.push(await e)
	}

	return { message: `File links:`, links }
})

//@ts-ignore - no way to tell TypeScript that this is where function gets those types in the first place
export = middyfy(getImages, schema)
