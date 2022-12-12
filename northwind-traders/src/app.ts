import express from 'express'
import config from 'config'
import ErrorHandler from '@Util/ErrorHandler'
import GetData from '@Routes/GetData'

const app = express()
app.use(express.json())
app.use('/getData', GetData)
app.use(ErrorHandler)

const port = process.env.PORT || config.get<number>('Server.port')

function start() {
	try {
		app.listen(port, () => console.log(`Server started on port ${port}`))
	} catch (e) {
		console.error(e)
	}
}

start()
