import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import { BadRequestException, VersioningType } from "@nestjs/common"
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger"
import * as cookieParser from "cookie-parser"
import helmet from "helmet"

async function bootstrap() {
	const app = await NestFactory.create(AppModule, {
		logger: ["error", "debug", "verbose", "warn"]
	})

	app.enableVersioning({
		type: VersioningType.URI
	})

	const whitelist = ["http://127.0.0.1:3001", "http://localhost:3001", "http://localhost:3000", "http://127.0.0.1:3000"]
	const corsOption = {
		origin: function (origin, callback) {
			if (whitelist.indexOf(origin) !== -1) {
				callback(null, true)
			} else {
				callback(new BadRequestException("Not allow by CORS"))
			}
		},
		credentials: true
	}
	// app.enableCors(corsOption)
	app.use(cookieParser())
	app.use(helmet())

	const config = new DocumentBuilder()
		.addBearerAuth()
		.setTitle("Simple Project")
		.setDescription("Simple Project API")
		.setVersion("1.0.1")
		.build()


	const document = SwaggerModule.createDocument(app, config)
	SwaggerModule.setup("api", app, document)

	await app.listen(+process.env.PORT, () => {
		console.log(
			`⚡ [server]: Server is running ${process.env.NODE_ENV} at http://localhost:${process.env.PORT}`
		)
	})
}

bootstrap().then()
