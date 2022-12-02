import { Router } from 'express'
import Local from '@Services/Local'

const router = Router()

router.get('/city/:citySlug', Local.City)
router.get('/postcode/:postcode', Local.Postcode)
router.get('/suburb/:stateSlug/:suburbSlug', Local.Suburb)

export default router
