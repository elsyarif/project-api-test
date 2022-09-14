import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { TypeOrmModule } from "@nestjs/typeorm"
import { DatabaseConfig } from "@config/database"
import { APP_GUARD } from "@nestjs/core"
import { JwtStrategy } from "@common/strategy/jwt.strategy"
import { AuthModule } from "@modules/auth/auth.module"
import { ProductsModule } from "@modules/products/products.module"
import { CategoriesModule } from "@modules/categories/categories.module"

@Module({
	imports: [
		ConfigModule.forRoot({
			envFilePath: ".env",
			isGlobal: true
		}),
		TypeOrmModule.forRoot(DatabaseConfig),
		AuthModule,
		CategoriesModule,
		ProductsModule
	],
	providers: [
		{
			provide: APP_GUARD,
			useClass: JwtStrategy
		}
	],
})
export class AppModule {}
