import { Controller, Get, Post, Put, Delete, Body, Param, HttpStatus, HttpException } from '@nestjs/common';
import { UsersService, User } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  async create(@Body() userData: Omit<User, 'id' | 'created_at'>) {
    try {
      return await this.usersService.create(userData);
    } catch (error) {
      throw new HttpException('Foydalanuvchi yaratishda xatolik', HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  async findAll() {
    return await this.usersService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    const user = await this.usersService.findById(parseInt(id));
    if (!user) {
      throw new HttpException('Foydalanuvchi topilmadi', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() userData: Partial<User>) {
    const user = await this.usersService.update(parseInt(id), userData);
    if (!user) {
      throw new HttpException('Foydalanuvchi topilmadi', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    const deleted = await this.usersService.delete(parseInt(id));
    if (!deleted) {
      throw new HttpException('Foydalanuvchi topilmadi', HttpStatus.NOT_FOUND);
    }
    return { message: 'Foydalanuvchi o\'chirildi' };
  }
}