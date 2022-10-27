import envGet from '@util/envGet'
import { TypedEventHandler } from './schema'
import AWS from 'aws-sdk'

const queue = new AWS.SQS()

export = <TypedEventHandler>(async (event) => {
	const { dbQueueUrl } = envGet('dbQueueUrl')
	const { username, password, shopToken, query } = event.body
	const params = {
		QueueUrl: dbQueueUrl,
		MessageBody: JSON.stringify({ username, password, shopToken, query })
	}

	await queue.sendMessage(params).promise()
	return { message: 'Request queued!' }
})
