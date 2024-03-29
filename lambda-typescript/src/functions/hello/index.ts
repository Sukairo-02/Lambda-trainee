import type { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from 'aws-lambda'

export = <Handler<APIGatewayProxyEvent, APIGatewayProxyResult>>(async (event) => {
	return {
		statusCode: 200,
		body: JSON.stringify(
			{
				message: 'Go Serverless v3.0! Your function executed successfully!',
				input: event
			},
			null,
			2
		)
	}
})

//Default AWS NodeJS template lambda
