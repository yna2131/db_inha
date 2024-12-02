import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { Category } from './category.entity';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categorysService: CategoryService) {}

  @Get()
  async findAllCategory(): Promise<Category[]> {
    return this.categorysService.findAllCategory();
  }

  @Post()
  async createCategory(
    @Body() categoryData: Partial<Category>,
  ): Promise<Category> {
    return this.categorysService.createCategory(categoryData);
  }

  @Put(':id')
  async updateCategory(
    @Param('id') category_id: number,
    @Body() categoryData: Partial<Category>,
  ): Promise<Category> {
    return this.categorysService.updateCategory(category_id, categoryData);
  }

  @Delete(':id')
  async deleteCategory(@Param('id') category_id: number): Promise<void> {
    return this.categorysService.deleteCategory(category_id);
  }
}
