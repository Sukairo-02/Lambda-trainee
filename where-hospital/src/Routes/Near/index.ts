import { Router } from 'express'
import Near from '@Services/Near'

const router = Router()

router.get('/city/:citySlug', Near.City)
router.get('/postcode/:postcode', Near.Postcode)
router.get('/suburb/:stateSlug/:suburbSlug', Near.Suburb)

export default router
