import {
	BadRequestException,
	Body,
	Controller,
	Delete,
	HttpCode,
	HttpStatus,
	Logger,
	Post,
	Req,
	Res,
	UseGuards,
	UsePipes,
	ValidationPipe,
	Version
} from "@nestjs/common"
import { ApiBearerAuth, ApiResponse, ApiTags } from "@nestjs/swagger"
import { Public } from "@common/decorators"
import { AuthService } from "@modules/auth/auth.service"
import { LoginAuthDto } from "@modules/auth/dto/login-auth.dto"
import { Request, Response } from "express"
import { Encrypt } from "@helper/crypto.helper"
import { RegisterUsersDto } from "@modules/users/dto/register-users.dto"
import { UsersService } from "@modules/users/users.service"
import { JwtAuthGuard } from "@common/guard/jwt-auth.guard"

@Controller("auth")
@ApiTags("Authentication")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AuthController {
	private readonly logger = new Logger(AuthController.name)

	constructor(
		private authService: AuthService,
		private userService: UsersService
	) {}

	@Public()
	@Post("login")
	@Version("1")
	@HttpCode(HttpStatus.OK)
	@ApiResponse({
		status: HttpStatus.OK,
		description: "User login successfully"
	})
	@ApiResponse({
		status: HttpStatus.BAD_REQUEST,
		description: "username/password invalid"
	})
	async login(
		@Body() loginDto: LoginAuthDto,
		@Req() req: Request,
		@Res() res: Response
	) {
		const user = await this.authService.validateUser(loginDto)

		const jwt = await this.authService.login(user)
		user.access_token = Encrypt(jwt.access_token)

		const payload = {
			id: user.id,
			username: user.username,
			ip: req.ip,
			user_agent: req.headers["user-agent"],
			access_token: Encrypt(jwt.access_token),
			refresh_token: Encrypt(jwt.refresh_token),
			cookie_token: req.cookies["x-refresh-token"] || ""
		}

		const userToken = await this.authService.findRefreshToken(
			payload.cookie_token
		)

		if (!userToken) {
			await this.authService.createToken(payload)
		} else {
			await this.authService.updateToken(payload)
		}

		res.cookie("x-refresh-token", Encrypt(jwt.refresh_token), {
			httpOnly: true,
			maxAge: 24 * 60 * 60 * 1000,
		})

		const { ...result } = user

		res.json({
			statusCode: HttpStatus.OK,
			message: "Login success",
			data: result
		})
	}

	@Public()
	@Post("register")
	@Version("1")
	@HttpCode(HttpStatus.CREATED)
	@UsePipes(new ValidationPipe({ transform: true }))
	@ApiResponse({
		status: HttpStatus.OK,
		description: "User register success"
	})
	async register(
		@Body() registerDto: RegisterUsersDto,
		@Res() res: Response
	) {
		const user = await this.userService.register(registerDto)

		const { password, ...result } = user

		res.json({
			statusCode: HttpStatus.CREATED,
			message: "Register success",
			data: result
		})
	}

	@Public()
	@Post("refresh-token")
	@Version("1")
	@HttpCode(HttpStatus.OK)
	async refreshToken(@Req() req: Request, @Res() res: Response) {
		const refreshToken = req.cookies["x-refresh-token"]
		if (!refreshToken) {
			throw new BadRequestException("Refresh token invalid")
		}

		const token = await this.authService.refreshToken(refreshToken)

		res.json({
			statusCode: HttpStatus.OK,
			message: "new access token created",
			data: {
				access_token: token
			}
		})
	}

	@Delete("logout")
	@Version("1")
	@HttpCode(HttpStatus.OK)
	async logout(@Req() req: Request, @Res() res: Response) {
		const token = req.cookies["x-refresh-token"]

		if (!token) {
			throw new BadRequestException('x-refresh-token not found')
		}

		req.user = null

		await this.authService.logout(token)

		res.clearCookie("x-refresh-token")
		res.json({
			statusCode: HttpStatus.OK,
			message: "logout success"
		})
	}
}
