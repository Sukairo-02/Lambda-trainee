import { Router, Request, Response } from 'express'
import config from 'config'
import db from '@util/dbBot'
import xtractUser from '@middleware/xtractUser'
import xtractBotBody from '@middleware/xtractBotBody'
import validateAuth from '@middleware/validateAuth'
import type { dbConfig } from '@util/dbApi/types'

const router = Router()
const dbConfig = config.get<dbConfig>('dbBot')

router.get('/favorites', [validateAuth, xtractUser], async (req: Request, res: Response) => {
	await db.connect(dbConfig)
	const result = await db.get(req.dbUser)
	await db.disconnect()

	if (!result) {
		return res.status(403).send('Invalid user!')
	}

	return res.json({ ...(<{}[]>result)[0] })
})

router.post('/favorites', [validateAuth, xtractBotBody], async (req: Request, res: Response) => {
	await db.connect(dbConfig)
	const result = await db.add(req.user, req.symbols!.accepted!)
	await db.disconnect()
	console.log(result?.result)
	return res.json({ ...(<{}[]>result?.result)[0], warning: result?.warning, symbols: req.symbols })
})

router.delete('/favorites', [validateAuth, xtractBotBody], async (req: Request, res: Response) => {
	await db.connect(dbConfig)
	const result = await db.remove(req.user, req.symbols!.accepted!)
	await db.disconnect()

	return res.json({ ...(<{}[]>result)[0], symbols: req.symbols })
})

export = router
