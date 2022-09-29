import schema from './schema'
import type { ValidatedHandler } from '@libs/ValidatedHandler'
import middyfy from '@libs/middyfy'
import AWS from 'aws-sdk'
import * as Boom from '@hapi/boom'

const cognito = new AWS.CognitoIdentityServiceProvider()

const userSignup = <
	ValidatedHandler<
		typeof schema.body,
		typeof schema.headers,
		typeof schema.pathParameters,
		typeof schema.queryStringParameters
	>
>(async (event) => {
	const { email, password } = event.body

	const { userPoolId, clientId } = process.env

	if (!userPoolId || !clientId) {
		throw Boom.internal('Undefined user pool ID!')
	}

	const params = {
		AuthFlow: 'ADMIN_NO_SRP_AUTH',
		UserPoolId: userPoolId,
		ClientId: clientId,
		AuthParameters: {
			USERNAME: email,
			PASSWORD: password
		}
	}

	const loginResp = await cognito.adminInitiateAuth(params).promise()

	return { message: `Succesfully logged in!`, ...loginResp.AuthenticationResult }
})

//@ts-ignore - no way to tell TypeScript that this is where function gets those types in the first place
export = middyfy(userSignup, schema)
