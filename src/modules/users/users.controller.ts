import {
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Req,
	Res,
	UseGuards,
	Version
} from "@nestjs/common"
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger"
import { Request, Response } from "express"
import { UsersService } from "./users.service"
import { JwtAuthGuard } from "@common/guard/jwt-auth.guard"

@Controller("users")
@ApiTags("Users")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class UsersController {
	constructor(private userService: UsersService) {}

	@Get("profile")
	@Version("1")
	@HttpCode(HttpStatus.OK)
	async profile(@Req() req: Request, @Res() res: Response) {
		const result = req.user

		res.json({
			statusCode: HttpStatus.OK,
			message: "user profile success",
			data: result
		})
	}
}
