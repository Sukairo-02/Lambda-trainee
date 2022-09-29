import schema from './schema'
import type { ValidatedHandler } from '@libs/ValidatedHandler'
import middyfy from '@libs/middyfy'
import * as Boom from '@hapi/boom'
import AWS from 'aws-sdk'
import { v4 } from 'uuid'

const storage = new AWS.S3()

const postImages = <
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

	const fileName = `${v4()}.img`

	const params = {
		Bucket: bucketName,
		Fields: {
			key: fileName,
			email: email
		},
		Expires: 300,
		Conditions: [
			['starts-with', '$Content-Type', 'image/'], //images only
			['content-length-range', 0, 10485760], //up to 10 MiB
			['eq', '$email', email] //tag with user's email for usage in db on S3 lambda trigger
		]
	}

	const postData = await storage.createPresignedPost(params)

	return { message: `Upload using given URL`, postData }
})

//@ts-ignore - no way to tell TypeScript that this is where function gets those types in the first place
export = middyfy(postImages, schema)
