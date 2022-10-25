import jsonBodyParser from '@middy/http-json-body-parser'

export type MiddyConfig = {
	parseBody?: typeof jsonBodyParser
	validateEvent?: boolean
	formatResponse?: boolean
	catchErrors?: boolean
}
