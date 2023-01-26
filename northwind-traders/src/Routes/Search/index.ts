import { Router } from 'express'
import Search from '@Controllers/Search'

const router = Router()

router.get('/customers/:name', Search.Customer)
router.get('/products/:name', Search.Product)
router.get('/customers', Search.EmptyQuery)
router.get('/products', Search.EmptyQuery)

export default router
