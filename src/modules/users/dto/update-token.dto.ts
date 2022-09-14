import { PartialType } from "@nestjs/swagger";
import { CreateTokenDto } from "@modules/users/dto/create-token.dto";

export class UpdateTokenDto extends PartialType(CreateTokenDto){
    cookie_token?: string
}
