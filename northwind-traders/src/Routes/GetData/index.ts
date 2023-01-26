import { Router } from 'express'
import GetData from '@Controllers/GetData'

const router = Router()

router.get('/customers', GetData.Customers)
router.get('/customer/:id', GetData.Customer)
router.get('/employees', GetData.Employees)
router.get('/employee/:id', GetData.Employee)
router.get('/suppliers', GetData.Suppliers)
router.get('/supplier/:id', GetData.Supplier)
router.get('/products', GetData.Products)
router.get('/product/:id', GetData.Product)
router.get('/orders', GetData.Orders)
router.get('/order/:id', GetData.Order)

export default router
