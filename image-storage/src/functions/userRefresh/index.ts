import schema from './schema'
import type { ValidatedHandler } from '@libs/ValidatedHandler'
import middyfy from '@libs/middyfy'
import AWS from 'aws-sdk'
import * as Boom from '@hapi/boom'

const cognito = new AWS.CognitoIdentityServiceProvider()

const helloName = <
	ValidatedHandler<
		typeof schema.body,
		typeof schema.headers,
		typeof schema.pathParameters,
		typeof schema.queryStringParameters
	>
>(async (event) => {
	const refreshToken = event.headers.Refresh

	if (!refreshToken) {
		throw Boom.badRequest('Invalid refresh token!')
	}

	const { userPoolId, clientId } = process.env

	if (!userPoolId || !clientId) {
		throw Boom.internal('Undefined user pool ID!')
	}

	const params = {
		AuthFlow: 'REFRESH_TOKEN',
		UserPoolId: userPoolId,
		ClientId: clientId,
		AuthParameters: {
			REFRESH_TOKEN: refreshToken
		}
	}

	const loginResp = await cognito.adminInitiateAuth(params).promise()

	return { message: `Succesfully refreshed token!`, ...loginResp.AuthenticationResult }
})

//@ts-ignore - no way to tell TypeScript that this is where function gets those types in the first place
export = middyfy(helloName, schema)
