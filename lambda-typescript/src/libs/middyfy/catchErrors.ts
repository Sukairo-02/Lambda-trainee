import type { Boom as BoomType } from '@hapi/boom'

export = () => {
	return {
		onError: async (event) => {
			console.error(event)

			if ((<BoomType>event?.error).isBoom) {
				return {
					statusCode: (<BoomType>event.error).output.statusCode,
					body: JSON.stringify(
						{
							message: (<BoomType>event?.error)?.message || 'Something went wrong. Try again later...'
						},
						null,
						2
					),
					headers: {
						'Content-Type': 'application/json'
					}
				}
			} else {
				return {
					statusCode: 500,
					body: JSON.stringify({ message: 'Something went wrong. Try again later...' }, null, 2)
				}
			}
		}
	}
}
