import { Injectable, ExecutionContext, Logger } from "@nestjs/common"
import { AuthGuard } from "@nestjs/passport"
import { Reflector } from "@nestjs/core"
import { Decrypt } from "@helper/crypto.helper"
import { IS_PUBLIC_KEY } from "@common/decorators"

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
	private readonly logger = new Logger(JwtAuthGuard.name)

	constructor(private reflector: Reflector) {
		super()
	}

	canActivate(context: ExecutionContext) {
		let token: string
		const request = context.switchToHttp().getRequest()
		const response = context.switchToHttp().getResponse()

		if (
			request.headers.authorization &&
			request.headers.authorization.startsWith("Bearer")
		) {
			token = request.headers.authorization.split(" ")[1]

			const decrypt = Decrypt(token)

			request.headers.authorization = `Bearer ${decrypt}`
		}

		const isPubic = this.reflector.getAllAndOverride<boolean>(
			IS_PUBLIC_KEY,
			[context.getHandler(), context.getClass()]
		)

		if (isPubic) {
			return true
		}

		return super.canActivate(context)
	}
}
