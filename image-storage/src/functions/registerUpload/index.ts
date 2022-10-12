import AWS from 'aws-sdk'

import type { S3Handler } from 'aws-lambda'

const storage = new AWS.S3()
const db = new AWS.DynamoDB.DocumentClient()

const registerUpload = <S3Handler>(async (event) => {
	const fNameDecoded = decodeURIComponent(event.Records[0].s3.object.key)
	const email = fNameDecoded.split('|').slice(0, -1).join('|') //get filename withoud UUID - | was used as splitter
	try {
		if (!email) {
			throw 'No email found!'
		}

		const fNameNoEmail = fNameDecoded.split(`${email}|`)[1]

		const { tableName } = process.env

		if (!tableName) {
			throw 'Missing table name!'
		}

		await db
			.update({
				TableName: tableName,
				Key: {
					email
				},
				UpdateExpression: 'ADD #files :fileName',
				ExpressionAttributeNames: {
					'#files': 'files'
				},
				ExpressionAttributeValues: {
					':fileName': db.createSet([fNameNoEmail])
				}
			})
			.promise()
	} catch (e) {
		console.log(e)
		//Delete file if failed to register in DB
		await storage
			.deleteObject({
				Bucket: event.Records[0].s3.bucket.name,
				Key: fNameDecoded
			})
			.promise()
		console.log(
			`Failed to write data to DB - deleting file ${fNameDecoded} from bucket ${event.Records[0].s3.bucket.name}`
		)
	}
})

export = registerUpload
