import { Controller, Get, Post, Body, Param, HttpStatus, HttpException } from '@nestjs/common';
import { CategoriesService, Category } from './categories.service';

@Controller('categories')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @Post()
  async create(@Body() categoryData: Omit<Category, 'id' | 'created_at'>) {
    return await this.categoriesService.create(categoryData);
  }

  @Get()
  async findAll() {
    return await this.categoriesService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    const category = await this.categoriesService.findById(parseInt(id));
    if (!category) {
      throw new HttpException('Kategoriya topilmadi', HttpStatus.NOT_FOUND);
    }
    return category;
  }
}