import { ApiProperty, PartialType } from "@nestjs/swagger"
import { CreateCategoriesDto, STATUS } from "./create-categories.dto";
import { IsNotEmpty } from "class-validator"

export class UpdateCategoriesDto extends PartialType(CreateCategoriesDto){}

export class StatusCategoriesDto{
	@ApiProperty({ enum: ['PUBLISH', 'DRAFT']})
    @IsNotEmpty()
    status:STATUS
}
