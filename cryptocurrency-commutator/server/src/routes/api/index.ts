import { Router, Request, Response } from 'express'
import config from 'config'

import xtractApis from '@middleware/xtractApis'
import xtractPeriod from '@middleware/xtractPeriod'
import xtractSymbols from '@middleware/xtractSymbols'

import cryptoList from '@util/lists/cryptoList'
import db from '@util/dbApi'
import type { dbConfig, apis } from '@util/dbApi/types'

const router = Router()
const dbConfig = config.get<dbConfig>('db')
const dataLackWarning = 'Warning: missing data on some time during selected period, results might be inaccurate.'

router.get('/average', [xtractApis, xtractPeriod, xtractSymbols], async (req: Request, res: Response) => {
	const result = await db.getAvg(req.symbols?.accepted, req.period, <apis[] | undefined>req.apis?.accepted)

	if (
		req.period &&
		(<[]>result)?.length <
			(req.symbols?.accepted?.length ? req.symbols.accepted.length : cryptoList.length) *
				Math.floor(Math.abs(req.period[1].getTime() - req.period[0].getTime()) / 300000)
	) {
		return res.json({ result, apis: req.apis, symbols: req.symbols, warning: dataLackWarning })
	}

	res.json({ result, apis: req.apis, symbols: req.symbols })
})

router.get('/period', [xtractApis, xtractPeriod, xtractSymbols], async (req: Request, res: Response) => {
	const result = await db.getPeriod(req.symbols?.accepted, req.period, <apis[] | undefined>req.apis?.accepted)

	res.json({ result, apis: req.apis, symbols: req.symbols })
})

export = router
