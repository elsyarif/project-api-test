import { ApiProperty, PartialType } from "@nestjs/swagger";
import { CreateProductVariantDto } from "./create-product-variant.dto";

export class UpdateProductVariantDto extends PartialType(CreateProductVariantDto){
	@ApiProperty()
	id?: string
}
