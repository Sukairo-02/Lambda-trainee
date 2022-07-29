//Borrowed from node-telegram-bot-api, @types/node-telegram-bot-api

interface User {
	id: number
	is_bot: boolean
	first_name: string
	last_name?: string | undefined
	username?: string | undefined
	language_code?: string | undefined
}

interface ChatPhoto {
	small_file_id: string
	big_file_id: string
}

interface ChatInviteLink {
	invite_link: string
	creator: User
	is_primary: boolean
	is_revoked: boolean
	expire_date?: number
	member_limit?: number
}

type ChatMemberStatus = 'creator' | 'administrator' | 'member' | 'restricted' | 'left' | 'kicked'

interface ChatMember {
	user: User
	status: ChatMemberStatus
	until_date?: number | undefined
	can_be_edited?: boolean | undefined
	can_post_messages?: boolean | undefined
	can_edit_messages?: boolean | undefined
	can_delete_messages?: boolean | undefined
	can_restrict_members?: boolean | undefined
	can_promote_members?: boolean | undefined
	can_change_info?: boolean | undefined
	can_invite_users?: boolean | undefined
	can_pin_messages?: boolean | undefined
	is_member?: boolean | undefined
	can_send_messages?: boolean | undefined
	can_send_media_messages?: boolean | undefined
	can_send_polls: boolean
	can_send_other_messages?: boolean | undefined
	can_add_web_page_previews?: boolean | undefined
}

type ChatType = 'private' | 'group' | 'supergroup' | 'channel'

interface ChatPermissions {
	can_send_messages?: boolean | undefined
	can_send_media_messages?: boolean | undefined
	can_send_polls?: boolean | undefined
	can_send_other_messages?: boolean | undefined
	can_add_web_page_previews?: boolean | undefined
	can_change_info?: boolean | undefined
	can_invite_users?: boolean | undefined
	can_pin_messages?: boolean | undefined
}

interface Chat {
	id: number
	type: ChatType
	title?: string | undefined
	username?: string | undefined
	first_name?: string | undefined
	last_name?: string | undefined
	photo?: ChatPhoto | undefined
	description?: string | undefined
	invite_link?: string | undefined
	pinned_message?: Message | undefined
	permissions?: ChatPermissions | undefined
	can_set_sticker_set?: boolean | undefined
	sticker_set_name?: string | undefined
	/**
	 * @deprecated since version Telegram Bot API 4.4 - July 29, 2019
	 */
	all_members_are_administrators?: boolean | undefined
}

interface InlineQuery {
	id: string
	from: User
	location?: Location | undefined
	query: string
	offset: string
}

type MessageEntityType =
	| 'mention'
	| 'hashtag'
	| 'cashtag'
	| 'bot_command'
	| 'url'
	| 'email'
	| 'phone_number'
	| 'bold'
	| 'italic'
	| 'underline'
	| 'strikethrough'
	| 'code'
	| 'pre'
	| 'text_link'
	| 'text_mention'

type ParseMode = 'Markdown' | 'MarkdownV2' | 'HTML'

interface MessageEntity {
	type: MessageEntityType
	offset: number
	length: number
	url?: string | undefined
	user?: User | undefined
}

interface FileBase {
	file_id: string
	file_size?: number | undefined
}

interface PhotoSize extends FileBase {
	width: number
	height: number
}

interface Audio extends FileBase {
	duration: number
	performer?: string | undefined
	title?: string | undefined
	mime_type?: string | undefined
	thumb?: PhotoSize | undefined
}

interface Document extends FileBase {
	thumb?: PhotoSize | undefined
	file_name?: string | undefined
	mime_type?: string | undefined
}

interface Video extends FileBase {
	width: number
	height: number
	duration: number
	thumb?: PhotoSize | undefined
	mime_type?: string | undefined
}

interface Voice extends FileBase {
	duration: number
	mime_type?: string | undefined
}

interface InputMediaBase {
	media: string
	caption?: string | undefined
	parse_mode?: ParseMode | undefined
}

interface InputMediaPhoto extends InputMediaBase {
	type: 'photo'
}

interface InputMediaVideo extends InputMediaBase {
	type: 'video'
	width?: number | undefined
	height?: number | undefined
	duration?: number | undefined
	supports_streaming?: boolean | undefined
}

type InputMedia = InputMediaPhoto | InputMediaVideo

interface VideoNote extends FileBase {
	length: number
	duration: number
	thumb?: PhotoSize | undefined
}

interface Game {
	title: string
	description: string
	photo: PhotoSize[]
	text?: string | undefined
	text_entities?: MessageEntity[] | undefined
	animation?: Animation | undefined
}

interface Animation extends FileBase {
	width: number
	height: number
	duration: number
	thumb?: PhotoSize | undefined
	file_name?: string | undefined
	mime_type?: string | undefined
}

interface MaskPosition {
	point: string
	x_shift: number
	y_shift: number
	scale: number
}

interface Sticker {
	file_id: string
	file_unique_id: string
	is_animated: boolean
	width: number
	height: number
	thumb?: PhotoSize | undefined
	emoji?: string | undefined
	set_name?: string | undefined
	mask_position?: MaskPosition | undefined
	file_size?: number | undefined
}

interface Contact {
	phone_number: string
	first_name: string
	last_name?: string | undefined
	user_id?: number | undefined
	vcard?: string | undefined
}

interface Venue {
	location: Location
	title: string
	address: string
	foursquare_id?: string | undefined
	foursquare_type?: string | undefined
}

type PollType = 'regular' | 'quiz'

interface PollAnswer {
	poll_id: string
	user: User
	option_ids: number[]
}

interface PollOption {
	text: string
	voter_count: number
}

interface Poll {
	id: string
	question: string
	options: PollOption[]
	is_closed: boolean
	is_anonymous: boolean
	allows_multiple_answers: boolean
	type: PollType
	total_voter_count: number
}

interface Invoice {
	title: string
	description: string
	start_parameter: string
	currency: string
	total_amount: number
}

interface ShippingAddress {
	country_code: string
	state: string
	city: string
	street_line1: string
	street_line2: string
	post_code: string
}

interface OrderInfo {
	name?: string | undefined
	phone_number?: string | undefined
	email?: string | undefined
	shipping_address?: ShippingAddress | undefined
}

interface SuccessfulPayment {
	currency: string
	total_amount: number
	invoice_payload: string
	shipping_option_id?: string | undefined
	order_info?: OrderInfo | undefined
	telegram_payment_charge_id: string
	provider_payment_charge_id: string
}

interface PassportFile {
	file_id: string
	file_size: number
	file_date: number
}

interface EncryptedPassportElement {
	type: string
	data?: string | undefined
	phone_number?: string | undefined
	email?: string | undefined
	files?: PassportFile[] | undefined
	front_side?: PassportFile | undefined
	reverse_side?: PassportFile | undefined
	selfie?: PassportFile | undefined
	translation?: PassportFile[] | undefined
	hash: string
}

interface EncryptedCredentials {
	data: string
	hash: string
	secret: string
}

interface PassportData {
	data: EncryptedPassportElement[]
	credentials: EncryptedCredentials
}

export interface InlineKeyboardMarkup {
	inline_keyboard: InlineKeyboardButton[][]
}

type CallbackGame = object

interface LoginUrl {
	url: string
	forward_text?: string | undefined
	bot_username?: string | undefined
	request_write_acces?: boolean | undefined
}

interface InlineKeyboardButton {
	text: string
	url?: string | undefined
	login_url?: LoginUrl | undefined
	callback_data?: string | undefined
	switch_inline_query?: string | undefined
	switch_inline_query_current_chat?: string | undefined
	callback_game?: CallbackGame | undefined
	pay?: boolean | undefined
}

interface ChosenInlineResult {
	result_id: string
	from: User
	location?: Location | undefined
	inline_message_id?: string | undefined
	query: string
}

interface CallbackQuery {
	id: string
	from: User
	message?: Message | undefined
	inline_message_id?: string | undefined
	chat_instance: string
	data?: string | undefined
	game_short_name?: string | undefined
}

interface ShippingQuery {
	id: string
	from: User
	invoice_payload: string
	shipping_address: ShippingAddress
}

interface PreCheckoutQuery {
	id: string
	from: User
	currency: string
	total_amount: number
	invoice_payload: string
	shipping_option_id?: string | undefined
	order_info?: OrderInfo | undefined
}

export interface Message {
	message_id: number
	from?: User | undefined
	date: number
	chat: Chat
	forward_from?: User | undefined
	forward_from_chat?: Chat | undefined
	forward_from_message_id?: number | undefined
	forward_signature?: string | undefined
	forward_sender_name?: string | undefined
	forward_date?: number | undefined
	reply_to_message?: Message | undefined
	edit_date?: number | undefined
	media_group_id?: string | undefined
	author_signature?: string | undefined
	text?: string | undefined
	entities?: MessageEntity[] | undefined
	caption_entities?: MessageEntity[] | undefined
	audio?: Audio | undefined
	document?: Document | undefined
	animation?: Animation | undefined
	game?: Game | undefined
	photo?: PhotoSize[] | undefined
	sticker?: Sticker | undefined
	video?: Video | undefined
	voice?: Voice | undefined
	video_note?: VideoNote | undefined
	caption?: string | undefined
	contact?: Contact | undefined
	location?: Location | undefined
	venue?: Venue | undefined
	poll?: Poll | undefined
	new_chat_members?: User[] | undefined
	left_chat_member?: User | undefined
	new_chat_title?: string | undefined
	new_chat_photo?: PhotoSize[] | undefined
	delete_chat_photo?: boolean | undefined
	group_chat_created?: boolean | undefined
	supergroup_chat_created?: boolean | undefined
	channel_chat_created?: boolean | undefined
	migrate_to_chat_id?: number | undefined
	migrate_from_chat_id?: number | undefined
	pinned_message?: Message | undefined
	invoice?: Invoice | undefined
	successful_payment?: SuccessfulPayment | undefined
	connected_website?: string | undefined
	passport_data?: PassportData | undefined
	reply_markup?: InlineKeyboardMarkup | undefined
}

export interface Update {
	update_id: number
	message?: Message | undefined
	edited_message?: Message | undefined
	channel_post?: Message | undefined
	edited_channel_post?: Message | undefined
	inline_query?: InlineQuery | undefined
	chosen_inline_result?: ChosenInlineResult | undefined
	callback_query?: CallbackQuery | undefined
	shipping_query?: ShippingQuery | undefined
	pre_checkout_query?: PreCheckoutQuery | undefined
}
