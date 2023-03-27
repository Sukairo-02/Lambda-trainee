export type WithoutNullableKeys<Type> = {
	[Key in keyof Type]-?: WithoutNullableKeys<NonNullable<Type[Key]>>
}

export type Cities = Partial<{
	city_slug: string
	city_name: string
	state: string
	meta_title: string
	meta_description: string
	H1: string
	H2: string
	sub_heading_text: string
	tick_1: string
	tick_2: string
	tick_3: string
	about_bookphysio: string
}>[]

export type ReadCities = () => Promise<Cities>

export type Clinics = Partial<{
	'Long Name Version': string
	'Typeform registration link': string
	PMS: string
	'Meta-title': string
	'Meta-description': string
	slug: string
	Website: string
	'Clinic Name': string
	Display_on_web: string //convert to boolean?
	'link to clinic suburb page': string
	'Full Address': string
	City: string
	Suburb: string
	State: string
	Postcode: string
	Email: string
	Phone: string
	nearby1_txt: string
	nearby1_link: string
	nearby2_txt: string
	nearby2_link: string
	nearby3_txt: string
	nearby3_link: string
	nearby4_txt: string
	nearby4_link: string
	'About Clinic': string
}>[]

export type ReadClincs = () => Promise<Clinics>

export type Suburbs = Partial<{
	field1: string
	'suburb-slug': string
	suburb_name: string
	City: string
	State: string
	Postcode: string
	meta_title: string
	meta_description: string
	H1: string
	H2: string
	about_bookphysio: string
	nearby1_txt: string
	nearby1_link: string
	nearby1_state: string
	nearby1_postcode: string
	nearby2_txt: string
	nearby2_link: string
	nearby2_state: string
	nearby2_postcode: string
	nearby3_txt: string
	nearby3_link: string
	nearby3_state: string
	nearby3_postcode: string
	nearby4_txt: string
	nearby4_link: string
	nearby4_state: string
	nearby4_postcode: string
}>[]

export type ReadSuburbs = () => Promise<Suburbs>
