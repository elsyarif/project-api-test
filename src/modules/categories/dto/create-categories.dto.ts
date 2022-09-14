import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty } from "class-validator"

export class CreateCategoriesDto {
    @ApiProperty()
    @IsNotEmpty()
    name:string

    @ApiProperty({ enum: ['PUBLISH', 'DRAFT']})
    @IsNotEmpty()
    status:STATUS

    @ApiProperty()
    @IsNotEmpty()
    description: string
}

export enum STATUS{
	PUBLISH = 'PUBLISH',
	DRAFT = 'DRAFT'
}
