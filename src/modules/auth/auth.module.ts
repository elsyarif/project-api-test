import { Module } from "@nestjs/common"
import { AuthService } from "./auth.service"
import { UsersModule } from "@modules/users/users.module"
import { JwtModule } from "@nestjs/jwt"
import { PassportModule } from "@nestjs/passport"
import { UsersService } from "@modules/users/users.service"
import { AuthController } from "./auth.controller"
import { TypeOrmModule } from "@nestjs/typeorm"
import { UsersTokens } from "@entities/users-tokens.entity"
import { LocalStrategy } from "@common/strategy/local-strategy"
import { ConfigModule } from "@nestjs/config"
import config from "@config/config"
import { JwtStrategy } from "@common/strategy/jwt.strategy";

@Module({
	imports: [
		TypeOrmModule.forFeature([UsersTokens]),
		UsersModule,
		PassportModule,
		ConfigModule.forRoot({
			load: [config],
			envFilePath: ".env",
			isGlobal: true
		}),
		JwtModule.register({
			secret: process.env.JWT_SECRET,
			signOptions: {
				expiresIn: process.env.JWT_EXPIRE_TIME
			}
		})
	],
	exports: [TypeOrmModule],
	providers: [AuthService, UsersService, LocalStrategy, JwtStrategy],
	controllers: [AuthController]
})
export class AuthModule {}
