export class CreateTokenDto {
	id: string
	username?: string
	access_token: string
	refresh_token: string
	ip?: string
	user_agent?: string
}
