import 'module-alias/register'
import config from 'config'
import tgBot from '@util/tgBot'

const PORT: number = Number(process.env.PORT) || config.get('server.PORT') || 3000
const url = config.get<string>('server.URL')
const botToken = config.get<string>('tg.bot')

const start = async () => {
	try {
		tgBot(botToken, PORT, url)
	} catch (e) {
		console.log(e)
	}
}

start()

process.on('unhandledRejection', (reason, promise) => {
	console.log('UNHANDLED:\n', reason, '\n', promise, '\n\n')
})

process.on('uncaughtException', (e, o) => {
	console.log('UNCAUGHT:\n', e, '\n', o, '\n\n')
})
