import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';

@Injectable()
export class CategoryService {
    constructor(
        @InjectRepository(Category)
        private categoryRepository: Repository<Category>,
    ) { }

    async findAll(): Promise<Category[]> {
        return this.categoryRepository.find();
    }

    async create(categoryData: Partial<Category>): Promise<Category> {
        const category = this.categoryRepository.create(categoryData);
        return this.categoryRepository.save(category);
    }

    async update(category_id: number, categoryData: Partial<Category>): Promise<Category> {
        await this.categoryRepository.update(category_id, categoryData);
        return this.categoryRepository.findOne({ where: { category_id } });
    }

    async delete(category_id: number): Promise<void> {
        await this.categoryRepository.delete(category_id);
    }
}
