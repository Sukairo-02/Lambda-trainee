import schema from './schema'
import type { ValidatedHandler } from '@libs/ValidatedHandler'
import middyfy from '@libs/middyfy'
import AWS from 'aws-sdk'
import * as Boom from '@hapi/boom'

const cognito = new AWS.CognitoIdentityServiceProvider()

const userRegister = <
	ValidatedHandler<
		typeof schema.body,
		typeof schema.headers,
		typeof schema.pathParameters,
		typeof schema.queryStringParameters
	>
>(async (event) => {
	const { email, password } = event.body
	const { userPoolId } = process.env

	if (!userPoolId) {
		throw Boom.internal('Undefined user pool ID!')
	}

	const userParams = {
		UserPoolId: userPoolId,
		Username: email,
		UserAttributes: [
			{
				Name: 'email',
				Value: email
			},
			{
				Name: 'email_verified',
				Value: 'true'
			}
		],
		MessageAction: 'SUPPRESS'
	}

	const creationResp = await cognito.adminCreateUser(userParams).promise()

	if (!creationResp.User) {
		throw Boom.internal('User creation error...')
	}

	const passParams = {
		Password: password,
		UserPoolId: userPoolId,
		Username: email,
		Permanent: true
	}

	await cognito.adminSetUserPassword(passParams).promise()

	return { message: `Succesfully registered as ${email}` }
})

//@ts-ignore - no way to tell TypeScript that this is where function gets those types in the first place
export = middyfy(userRegister, schema)
