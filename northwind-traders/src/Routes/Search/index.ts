import { Router } from 'express'
import Search from '@Controllers/Search'
import CheckTabId from '@Middleware/CheckTabId'

const router = Router()

router.get('/customers/:name', CheckTabId, CheckTabId, Search.Customer)
router.get('/products/:name', CheckTabId, CheckTabId, Search.Product)
router.get('/customers', CheckTabId, CheckTabId, Search.EmptyQuery)
router.get('/products', CheckTabId, CheckTabId, Search.EmptyQuery)

export default router
