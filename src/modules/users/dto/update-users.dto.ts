import { PartialType } from "@nestjs/swagger";
import { RegisterUsersDto } from "@modules/users/dto/register-users.dto";

export class UpdateUsersDto extends PartialType(RegisterUsersDto) {
	role: string
	is_active: boolean
}
