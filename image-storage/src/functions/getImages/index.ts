import schema from './schema'
import type { ValidatedHandler } from '@libs/ValidatedHandler'
import middyfy from '@libs/middyfy'
import * as Boom from '@hapi/boom'
import AWS from 'aws-sdk'

const storage = new AWS.S3()

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

	const bucketName = process.env.bucketName

	if (!bucketName) {
		return Boom.internal('Missing bucket name!')
	}

	//Some code to get user's filenames from db

	const userFiles = ['file uno.png', 'file two.jpg', 'file три.img']

	const promises: Promise<string>[] = []
	for (const e of userFiles) {
		promises.push(
			storage.getSignedUrlPromise('getObject', {
				Bucket: bucketName,
				Key: e,
				Expires: 300
			})
		)
	}

	const links: string[] = []
	for (const e of promises) {
		links.push(await e)
	}

	return { message: `File list:`, links }
})

//@ts-ignore - no way to tell TypeScript that this is where function gets those types in the first place
export = middyfy(getImages, schema)
