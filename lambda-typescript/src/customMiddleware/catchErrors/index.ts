export = (
	callback: (error: Error) => void = (error) => {
		console.error(error)
	}
) => {
	return {
		onError: async (event) => {
			return callback(event.error)
		}
	}
}
