import { ApiProperty, PartialType } from "@nestjs/swagger"
import { CreateProductsDto } from "./create-products.dto"
import { UpdateProductVariantDto } from './update-product-variant.dto';

export class UpdateProductsDto extends PartialType(CreateProductsDto){
	@ApiProperty({
		type: [UpdateProductVariantDto]
	})
	variant?: Variant[];
}

interface Variant{
	id: string
    product?: string
    sku: string,
    name: string,
    model: string,
    price: number,
    cost: number,
    stock: number,
    minimum: number
    unit: string
    description?: string
}
