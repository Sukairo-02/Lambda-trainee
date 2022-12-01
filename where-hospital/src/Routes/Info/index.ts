import { Router } from 'express'
import Info from '@Services/Info'

const router = Router()

router.get('/city', Info.City)
router.get('/city/byState/:stateSlug', Info.CityByState)
router.get('/city/:citySlug', () => Info.CitySlug)
router.get('/suburb', Info.Suburb)
router.get('/suburb/:stateSlug', Info.SuburbByState)
router.get('/suburb/:stateSlug/:suburbSlug', Info.SuburbSlug)
router.get('/nearbySuburbs/:stateSlug/:suburbSlug', Info.NearbySuburbs)
router.get('/clinic', Info.Clinic)
router.get('/clinic/:clinicSlug', Info.ClinicSlug)

export default router
