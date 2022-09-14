import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductVariant } from '@entities/products-variant.entity';
import { Products } from '@entities/products.entity';
import { ProductsController } from './products.controller';
import { ProductService } from './products.service';
import { ProductsVariantController } from './products-variant.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Products, ProductVariant])],
  exports: [TypeOrmModule],
  providers: [ProductService],
  controllers: [ProductsController, ProductsVariantController]
})
export class ProductsModule {}
