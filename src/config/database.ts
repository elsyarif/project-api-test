import { TypeOrmModuleOptions } from "@nestjs/typeorm"
import * as dotenv from "dotenv"
dotenv.config()

export const DatabaseConfig: TypeOrmModuleOptions = {
	type: "mysql",
	host: process.env.DB_HOST,
	port: +process.env.DB_PORT,
	username: process.env.DB_USERNAME,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_DATABASE,
	entities: [__dirname + "/../*/*.entity.{js,ts}"],
	logging: false,
	synchronize: true,
	cache: {
		type: 'ioredis',
		options: {
			host: process.env.REDIS_HOST,
			port: process.env.REDIS_PORT
		},
		ignoreErrors: true
	}
}
