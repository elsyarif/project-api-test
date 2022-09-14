import { Categories } from "@entities/categories.entity";
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import {UpdateCategoriesDto} from "./dto/update-categories.dto"
import { CreateCategoriesDto } from "./dto/create-categories.dto";
import * as slug from 'slug';

@Injectable()
export class CategoriesService{
    constructor(
        @InjectRepository(Categories)
        private categoriesRepositor: Repository<Categories>
    ){}

    async create(createDto: CreateCategoriesDto){
		try {
			const category = new Categories()
			category.name = createDto.name
			category.status = createDto.status
			category.description = createDto.description

			return await this.categoriesRepositor.save(category)

		} catch (error) {
			throw new BadRequestException(error.message)
		}
    }

    async findAll(){
        return await this.categoriesRepositor.find({
			where: {
				status: "PUBLISH"
			}
		})
    }

    async findOne(id: string){
        const category = await this.categoriesRepositor.findOneBy({
            id: id
        })

        if(!category){
            throw new NotFoundException("Categories not found")
        }

        return category
    }

    async update(id: string, updateDto: UpdateCategoriesDto){
        const category = await this.findOne(id)
        category.name = updateDto.name
        category.status = updateDto.status
        category.description = updateDto.description

        return await this.categoriesRepositor.save(category)
    }

	async updateStatus(id: string, status: string){
        const category = await this.findOne(id)
        category.status = status
		return await this.categoriesRepositor.save(category)
	}

    async remove(id: string){
        const category = await this.findOne(id)

        return await this.categoriesRepositor.remove(category)
    }
}
