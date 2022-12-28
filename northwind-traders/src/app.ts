import express from 'express'
import config from 'config'
import ErrorHandler from '@Util/ErrorHandler'
import GetData from '@Routes/GetData'
import Dashboard from '@Routes/Dashboard'
import Search from '@Routes/Search'

const app = express()
app.use(express.json())
app.use('/getData', GetData)
app.use('/dasboard', Dashboard)
app.use('/search', Search)
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
