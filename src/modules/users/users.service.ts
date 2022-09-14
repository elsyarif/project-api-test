import {
	BadRequestException,
	ConflictException,
	Injectable,
	Logger,
	NotFoundException
} from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Users } from "@entities/users.entity"
import { DataSource, Repository } from "typeorm"
import { RegisterUsersDto } from "@modules/users/dto/register-users.dto"
import { UpdateUsersDto } from "@modules/users/dto/update-users.dto"
import { CreateTokenDto } from "@modules/users/dto/create-token.dto"
import { UsersTokens } from "@entities/users-tokens.entity"
import { UpdateTokenDto } from "@modules/users/dto/update-token.dto"
import { UsersGroup } from "@entities/users_group.entity"

@Injectable()
export class UsersService {
	private readonly logger = new Logger(UsersService.name)

	constructor(
		@InjectRepository(Users)
		private userRepository: Repository<Users>,
		@InjectRepository(UsersTokens)
		private tokenRepository: Repository<UsersTokens>,
		@InjectRepository(UsersGroup)
		private groupRepository: Repository<UsersGroup>,
		private dataSource: DataSource
	) {}

	async register(registerDto: RegisterUsersDto): Promise<any> {
		const dataSource = await this.dataSource.createQueryRunner()

		await dataSource.connect()
		await dataSource.startTransaction()

		const exist = await this.userRepository.findOneBy({
			username: registerDto.username
		})

		if (exist) {
			throw new ConflictException('username already taken!')
		}

		try {
			const user = new Users()
			user.name = registerDto.name
			user.email = registerDto.email
			user.username = registerDto.username
			user.password = registerDto.password
			await user.hashPassword()
			user.is_active = true

			return await this.userRepository.save(user)
		} catch (e) {
			this.logger.error(`${UsersService.name} : register`, e.message)

			await dataSource.rollbackTransaction()
		} finally {
			await dataSource.release()
		}
	}

	async findOne(username: string): Promise<Users> {
		const user = await this.userRepository.findOne({
			where: {
				username: username
			}
		})

		if (!user) {
			throw new NotFoundException()
		}

		return user
	}

	async findById(userId: string): Promise<Users> {
		const user = await this.userRepository.findOne({
			where: {
				id: userId
			}
		})

		if (!user) {
			throw new NotFoundException()
		}

		return user
	}

	async update(id: string, updateDto: UpdateUsersDto): Promise<Users> {
		const user = await this.findById(id)
		user.name = updateDto.name
		user.username = updateDto.username
		user.is_active = updateDto.is_active

		return await this.userRepository.save(user)
	}

	async remove(id: string): Promise<Users> {
		const user = await this.findById(id)

		return await this.userRepository.remove(user)
	}

	// TODO: insert user access_token to database
	async saveToken(tokenDto: CreateTokenDto): Promise<any> {
		const dataSource = this.dataSource.createQueryRunner()
		await dataSource.connect()
		await dataSource.startTransaction()

		const users = await dataSource.manager.getRepository(Users)
		const userToken = await dataSource.manager.getRepository(UsersTokens)

		const user = await users.findOneBy({
			id: tokenDto.id
		})

		try {
			const newUserToken = new UsersTokens()
			newUserToken.user = user.id
			newUserToken.access_token = tokenDto.access_token
			newUserToken.refresh_token = tokenDto.refresh_token
			newUserToken.ip = tokenDto.ip
			newUserToken.user_agent = tokenDto.user_agent

			await userToken.save(newUserToken)
			await dataSource.commitTransaction()

			return newUserToken
		} catch (e) {
			this.logger.error(`${UsersService.name} : saveToken`, e.message)
			await dataSource.rollbackTransaction()
			throw new BadRequestException(e.message)
		} finally {
			await dataSource.release()
		}
	}

	// TODO: update user new access_token to database
	async updateToken(tokenDto: UpdateTokenDto): Promise<any> {
		const dataSource = this.dataSource.createQueryRunner()
		await dataSource.connect()
		await dataSource.startTransaction()

		const userToken = await dataSource.manager.getRepository(UsersTokens)

		try {
			const tokenUser = await userToken.findOneBy({
				refresh_token: tokenDto.cookie_token
			})

			tokenUser.access_token = tokenDto.access_token
			tokenUser.refresh_token = tokenDto.refresh_token
			tokenUser.ip = tokenDto.ip
			tokenUser.user_agent = tokenDto.user_agent

			await userToken.save(tokenUser)
			await dataSource.commitTransaction()

			return tokenUser
		} catch (e) {
			this.logger.error(`${UsersService.name} : update`, e.message)
			await dataSource.rollbackTransaction()
		} finally {
			await dataSource.release()
		}
	}

	//TODO: delete user token from database
	async removeToken(refreshToken: string): Promise<void> {
		const dataSource = this.dataSource.createQueryRunner()
		await dataSource.connect()
		await dataSource.commitTransaction()

		const tokenRepository = await dataSource.manager.getRepository(
			UsersTokens
		)

		try {
			const userToken = await tokenRepository.findOneBy({
				refresh_token: refreshToken
			})

			await this.tokenRepository.remove(userToken)
			await dataSource.commitTransaction()
		} catch (e) {
			this.logger.error(`${UsersService.name} : saveToken`, e.message)
			await dataSource.rollbackTransaction()

			throw new BadRequestException(e.message)
		} finally {
			await dataSource.release()
		}
	}

	//TODO: find refresh token from database
	async findRefreshToken(refreshToken: string): Promise<UsersTokens> {
		return await this.tokenRepository.findOneBy({
			refresh_token: refreshToken
		})
	}

	async updateUserActivate(userId: string): Promise<Users> {
		const user = await this.findById(userId)
		user.is_active = true

		return await this.userRepository.save(user)
	}

	//TODO: forget password
	async forgotPassword(
		userId: string,
		forgetToken: string,
		validateCode: number,
		password: string
	) {
		//1. cek forgetToken to table
		//2. cak validateCode from user and compare from database
		//3. find userid and update a new password
	}


	async userRemoveToken(refreshToken: string) {
		const userToken = await this.findRefreshToken(refreshToken)

		return await this.tokenRepository.remove(userToken)
	}

}
