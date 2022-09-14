import {
	Controller,
	Delete,
	Get,
	HttpCode,
	Patch,
	Post,
	UseGuards,
	Version,
	HttpStatus,
	ParseUUIDPipe,
	Body,
	Res,
	Req,
	Param,
	UsePipes,
	ValidationPipe
} from "@nestjs/common"
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger"
import { JwtAuthGuard } from "@common/guard/jwt-auth.guard"
import { Request, Response } from "express"
import { ProductService } from "./products.service"
import { CreateProductVariantDto, ProductVariantDto } from './dto/create-product-variant.dto';
import { UpdateProductVariantDto } from "./dto/update-product-variant.dto"

@Controller("product-variants")
@ApiTags("Product Variants")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class ProductsVariantController {

	constructor(
		private productService: ProductService
	) {}

	// variant
	@Post(":productId")
	@Version("1")
	@HttpCode(HttpStatus.CREATED)
	@UsePipes(new ValidationPipe({ transform: true }))
	async createVariant(
		@Param("productId", ParseUUIDPipe) productId: string,
		@Body() variantDto: ProductVariantDto,
		@Res() res: Response
	) {
		const variant = await this.productService.createVariant(productId, variantDto.variant)

		res.json({
			statusCode: HttpStatus.CREATED,
			message: "Product variant create success",
			data: variant
		})
	}

	@Get()
	@Version("1")
	@HttpCode(HttpStatus.OK)
	async findAllVariant(
		@Res() res: Response
	) {
		const variant = await this.productService.findAllVariant()

		res.json({
			statusCode: HttpStatus.OK,
			message: "Product variant find success",
			data: variant
		})
	}

	@Get(":id")
	@Version("1")
	@HttpCode(HttpStatus.OK)
	async findOneVariant(
		@Param("id", ParseUUIDPipe) id: string,
		@Res() res: Response
	) {
		const variant = await this.productService.findOneVariant(id)

		res.json({
			statusCode: HttpStatus.OK,
			message: "Product variant find success",
			data: variant
		})
	}

	@Patch(":id")
	@Version("1")
	@HttpCode(HttpStatus.OK)
	@UsePipes(new ValidationPipe({ transform: true }))
	async updateVariant(
		@Param("id", ParseUUIDPipe) id: string,
		@Body() variantDto: UpdateProductVariantDto,
		@Res() res: Response
	) {
		const variant = await this.productService.updateVariant(id, variantDto)

		res.json({
			statusCode: HttpStatus.OK,
			message: "Product variant update success",
			data: variant
		})
	}

	@Delete(":id")
	@Version("1")
	@HttpCode(HttpStatus.OK)
	async removeVariant(
		@Param("id", ParseUUIDPipe) id: string,
		@Res() res: Response
	) {
		const variant = await this.productService.removeVariant(id)

		res.json({
			statusCode: HttpStatus.OK,
			message: "Product variant delete success",
			data: null
		})
	}
}
