import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { CategoryService } from './category.service';
import { Category } from './category.entity';

@Controller('categorys')
export class CategorysController {
    constructor(private readonly categorysService: CategoryService) { }

    @Get()
    async findAll(): Promise<Category[]> {
        return this.categorysService.findAll();
    }

    @Post()
    async create(@Body() categoryData: Partial<Category>): Promise<Category> {
        return this.categorysService.create(categoryData);
    }

    @Put(':category_id')
    async update(
        @Param('category_id') category_id: number,
        @Body() categoryData: Partial<Category>,
    ): Promise<Category> {
        return this.categorysService.update(category_id, categoryData);
    }

    @Delete(':category_id')
    async delete(@Param('category_id') category_id: number): Promise<void> {
        return this.categorysService.delete(category_id);
    }
}
