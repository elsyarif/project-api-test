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
import { CreateProductsDto } from "./dto/create-products.dto"
import { Request, Response } from "express"
import { ProductService } from "./products.service"
import { UpdateProductsDto } from "./dto/update-products.dto"
import { CreateProductVariantDto } from "./dto/create-product-variant.dto"

@Controller("products")
@ApiTags("Products")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class ProductsController {

	constructor(
		private productService: ProductService
	) {}

	@Post()
	@Version("1")
	@HttpCode(HttpStatus.CREATED)
	@UsePipes(new ValidationPipe({ transform: true }))
	async create(
		@Body() createDto: CreateProductsDto,
		@Req() req: Request,
		@Res() res: Response
	) {
		const user: any = req.user
		createDto.user = user.id
		const {product, variant} = await this.productService.create(createDto)

		let result: any
		result = product
		result.variant = variant

		res.json({
			statusCode: HttpStatus.CREATED,
			message: "Product create success",
			data: result,
		})
	}

	@Get()
	@Version("1")
	@HttpCode(HttpStatus.OK)
	async findAll(
		@Res() res: Response
	) {
		const product = await this.productService.findAll()

		res.json({
			statusCode: HttpStatus.OK,
			message: "Product find success",
			data: product
		})
	}

	@Get(":id")
	@Version("1")
	@HttpCode(HttpStatus.OK)
	async findOne(
		@Param("id", ParseUUIDPipe) id: string,
		@Res() res: Response
	) {
		const product = await this.productService.findOne(id)

		res.json({
			statusCode: HttpStatus.OK,
			message: "Product find success",
			data: product
		})
	}

	@Patch(":id")
	@Version("1")
	@HttpCode(HttpStatus.OK)
	@UsePipes(new ValidationPipe({ transform: true }))
	async update(
		@Param("id", ParseUUIDPipe) id: string,
		@Body() updateDto: UpdateProductsDto,
		@Res() res: Response
	) {
		const {product, variant} = await this.productService.update(id, updateDto)

		let result: any
		result = product
		result.variant = variant

		res.json({
			statusCode: HttpStatus.OK,
			message: "Product update success",
			data: result
		})
	}

	@Delete(":id")
	@Version("1")
	@HttpCode(HttpStatus.OK)
	async remove(
		@Param("id", ParseUUIDPipe) id: string,
		@Res() res: Response
	) {
		await this.productService.remove(id)

		res.json({
			statusCode: HttpStatus.OK,
			message: "Product delete success",
			data: null
		})
	}
}
