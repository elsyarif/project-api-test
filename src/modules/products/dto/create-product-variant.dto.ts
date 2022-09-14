import { ApiProperty } from "@nestjs/swagger"

export class CreateProductVariantDto{
    product?: string

    @ApiProperty()
    sku: string

    @ApiProperty()
    name: string

    @ApiProperty()
    model: string

    @ApiProperty()
    price: number

    @ApiProperty()
    cost: number

    @ApiProperty()
    stock: number

    @ApiProperty()
    minimum: number

    @ApiProperty()
    unit: string

    @ApiProperty({required: false})
    description?: string
}

export class ProductVariantDto{
    @ApiProperty({
        type: [CreateProductVariantDto]
    })
    variant: Variant[]
}

interface Variant{
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
