import { Module } from "@nestjs/common"
import { UsersService } from "./users.service"
import { TypeOrmModule } from "@nestjs/typeorm"
import { Users } from "@entities/users.entity"
import { UsersTokens } from "@entities/users-tokens.entity"
import { UsersController } from "./users.controller"
import { UsersGroup } from "@entities/users_group.entity"

@Module({
	imports: [
		TypeOrmModule.forFeature([
			Users,
			UsersTokens,
			UsersGroup
		])
	],
	exports: [TypeOrmModule],
	providers: [UsersService],
	controllers: [UsersController]
})
export class UsersModule {}
