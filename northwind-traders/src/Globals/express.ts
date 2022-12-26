declare module 'express-serve-static-core' {
	namespace Express {
		interface Request {
			headers: {
				tabUUID: string
			}
		}
	}
}
