import express from 'express'
import config from 'config'
import ErrorHandler from '@Util/ErrorHandler'

import Info from '@Routes/Info'

const app = express()
app.use(express.json())

app.use('/info', Info)

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
