import type { S3Handler } from 'aws-lambda'
const registerUpload = <S3Handler>(async (event) => {
	console.log(JSON.stringify(event))
})

export = registerUpload
