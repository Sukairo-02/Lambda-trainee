import s from './schema'

import type { TypedHandler } from '@Util/TypedHandler'

export type InfoControllerHandlers = {
	city: TypedHandler<
		typeof s.city,
		{
			cities: {
				name: string
				slug: string
				state: string
			}[]
		}
	>
	cityByState: TypedHandler<
		typeof s.cityByState,
		{
			cities: {
				name: string
				slug: string
				state: string
			}[]
		}
	>
	citySlug: TypedHandler<
		typeof s.citySlug,
		{
			city: {
				slug: string
				name: string
				state: string
				metaTitle: string | null
				metaDesc: string | null
				h1: string | null
				h2: string | null
				subHeading: string | null
				tickOne: string | null
				tickTwo: string | null
				tickThree: string | null
				about: string | null
			}
		}
	>
	suburb: TypedHandler<
		typeof s.suburb,
		{
			suburbs: {
				name: string
				slug: string
				city: string
			}[]
		}
	>
	suburbByState: TypedHandler<
		typeof s.suburbByState,
		{
			suburbs: {
				name: string
				slug: string
				city: string
			}[]
		}
	>
	suburbSlug: TypedHandler<
		typeof s.suburbSlug,
		{
			suburb: {
				slug: string
				name: string
				metaTitle: string | null
				metaDesc: string | null
				h1: string | null
				h2: string | null
				about: string | null
				citySlug: string
			}
		}
	>
	nearbySuburbs: TypedHandler<
		typeof s.nearbySuburbs,
		{
			suburbs: {
				name: string
				slug: string
				city: string
			}[]
		}
	>
	clinic: TypedHandler<
		typeof s.clinic,
		{
			clinics: {
				slug: string
				name: string
				longName: string
				citySlug: string
				suburbSlug: string
				city: string
				suburb: string | null
				pms: string
			}[]
		}
	>
	clinicSlug: TypedHandler<
		typeof s.clinicSlug,
		{
			clinic: {
				slug: string
				name: string
				metaTitle: string | null
				metaDesc: string | null
				about: string | null
				longName: string
				citySlug: string
				suburbSlug: string
				cityName: string
				suburbName: string | null
				fullAddress: string
				pms: string
				typeform: string | null
				website: string | null
				email: string | null
				phone: string | null
			}
		}
	>
}

export default InfoControllerHandlers
