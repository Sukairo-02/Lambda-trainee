import { Router } from 'express'
import GetData from '@Controllers/GetData'
import CheckTabId from '@Middleware/CheckTabId'

const router = Router()

router.get('/customers', CheckTabId, GetData.Customers)
router.get('/customer/:id', CheckTabId, GetData.Customer)
router.get('/employees', CheckTabId, GetData.Employees)
router.get('/employee/:id', CheckTabId, GetData.Employee)
router.get('/suppliers', CheckTabId, GetData.Suppliers)
router.get('/supplier/:id', CheckTabId, GetData.Supplier)
router.get('/products', CheckTabId, GetData.Products)
router.get('/product/:id', CheckTabId, GetData.Product)
router.get('/orders', CheckTabId, GetData.Orders)
router.get('/order/:id', CheckTabId, GetData.Order)

export default router
