export = () => {
	return {
		after: async (event) => {
			event.response = {
				statusCode: 200,
				body: JSON.stringify(event.response, null, 2),
				headers: {
					'Content-Type': 'application/json'
				}
			}
		}
	}
}
