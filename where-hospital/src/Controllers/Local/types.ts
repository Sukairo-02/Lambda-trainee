import s from './schema'

import type { TypedHandler } from '@Util/TypedHandler'

export type LocalControllerHandlers = {
	city: TypedHandler<
		typeof s.city,
		{
			clinics: {
				citySlug: string
				suburbSlug: string
				slug: string
				name: string
				longName: string
				metaTitle: string | null
				metaDesc: string | null
				about: string | null
				cityName: string
				suburbName: string | null
				fullAddress: string
				pms: string
				typeform: string | null
				website: string | null
				email: string | null
				phone: string | null
			}[]
		}
	>
	postcode: TypedHandler<
		typeof s.postcode,
		{
			clinics: {
				citySlug: string
				suburbSlug: string
				slug: string
				name: string
				longName: string
				metaTitle: string | null
				metaDesc: string | null
				about: string | null
				cityName: string
				suburbName: string | null
				fullAddress: string
				pms: string
				typeform: string | null
				website: string | null
				email: string | null
				phone: string | null
			}[]
		}
	>
	suburb: TypedHandler<
		typeof s.suburb,
		{
			clinics: {
				citySlug: string
				suburbSlug: string
				slug: string
				name: string
				longName: string
				metaTitle: string | null
				metaDesc: string | null
				about: string | null
				cityName: string
				suburbName: string | null
				fullAddress: string
				pms: string
				typeform: string | null
				website: string | null
				email: string | null
				phone: string | null
			}[]
		}
	>
}

export default LocalControllerHandlers
