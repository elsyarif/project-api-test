import {
	BadRequestException,
	ForbiddenException,
	Injectable,
	Logger,
	NotFoundException
} from "@nestjs/common"
import { UsersService } from "@modules/users/users.service"
import { JwtService } from "@nestjs/jwt"
import { LoginAuthDto } from "@modules/auth/dto/login-auth.dto"
import { IUser } from "@modules/auth/interface/IUser"
import { InjectRepository } from "@nestjs/typeorm"
import { UsersTokens } from "@entities/users-tokens.entity"
import { Repository } from "typeorm"
import { CreateTokenDto } from "@modules/users/dto/create-token.dto"
import { UpdateTokenDto } from "@modules/users/dto/update-token.dto"
import { Decrypt, Encrypt } from "@helper/crypto.helper"

@Injectable()
export class AuthService {
	private readonly logger = new Logger(AuthService.name)

	constructor(
		private userService: UsersService,
		private jwtService: JwtService,
		@InjectRepository(UsersTokens)
		private tokenRepository: Repository<UsersTokens>
	) {}

	async validateUser(loginDto: LoginAuthDto): Promise<IUser> {
		const user = await this.userService.findOne(loginDto.username)

		if (!user.is_active) {
			throw new ForbiddenException("User inactivate")
		}

		if (user && (await user.checkPassword(loginDto.password))) {
			const { password, ...result } = user

			return result
		}

		throw new BadRequestException("username/password invalid")
	}

	async login(user: any): Promise<any> {

		const payload = {
			id: user.id,
			username: user.username,
		}

		return {
			access_token: this.jwtService.sign(payload),
			refresh_token: this.jwtService.sign(payload, {
				secret: process.env.JWT_SECRET_REFRESH_TOKEN,
				expiresIn: process.env.JWT_EXPIRE_TIME_REFRESH_TOKEN
			})
		}
	}

	async logout(refreshToken: string) {
		return await this.userService.userRemoveToken(refreshToken)
	}

	async findRefreshToken(refreshToken: string) {
		return await this.userService.findRefreshToken(refreshToken)
	}

	async refreshToken(refreshToken: string) {
		const token = await this.userService.findRefreshToken(refreshToken)

		if (!token) {
			throw new BadRequestException("refresh token not found")
		}

		const decrypt = Decrypt(token.refresh_token)
		const decode = this.jwtService.verify(decrypt, {
			secret: process.env.JWT_SECRET_REFRESH_TOKEN
		})

		const isExp = decode.exp * 1000 <= Date.parse(Date())
		if (isExp) {
			throw new BadRequestException("Refresh Token expire")
		}

		const { ...user } = await this.userService.findById(decode.id)

		const payload = {
			id: user.id,
			username: user.username,
		}

		const access_token = this.jwtService.sign(payload)
		// save access_token to database
		const tokenDto = {
			id: token.id,
			access_token: Encrypt(access_token),
			refresh_token: token.refresh_token
		}

		await this.updateToken(tokenDto)

		return Encrypt(access_token)
	}

	async createToken(tokenDto: CreateTokenDto) {
		return await this.userService.saveToken(tokenDto)
	}

	async updateToken(updateDto: UpdateTokenDto) {
		return await this.userService.updateToken(updateDto)
	}
}
