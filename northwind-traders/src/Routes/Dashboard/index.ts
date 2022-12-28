import { Router } from 'express'
import Dashboard from '@Controllers/Dashboard'
import CheckTabId from '@Middleware/CheckTabId'

const router = Router()

router.get('/requests', CheckTabId, CheckTabId, Dashboard.Requests)

export default router
