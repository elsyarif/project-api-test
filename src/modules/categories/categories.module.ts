import { Categories } from '@entities/categories.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';

@Module({
    imports: [TypeOrmModule.forFeature([Categories])],
    exports: [TypeOrmModule],
    providers: [CategoriesService],
    controllers: [CategoriesController]
})
export class CategoriesModule {}
