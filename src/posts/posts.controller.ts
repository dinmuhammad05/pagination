import { Controller, Get, Post, Body, Param, HttpStatus, HttpException } from '@nestjs/common';
import { PostsService, Post as PostInterface } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Post()
  async create(@Body() postData: Omit<PostInterface, 'id' | 'created_at' | 'updated_at'>) {
    return await this.postsService.create(postData);
  }

  @Get()
  async findAll() {
    return await this.postsService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    const post = await this.postsService.findById(parseInt(id));
    if (!post) {
      throw new HttpException('Post topilmadi', HttpStatus.NOT_FOUND);
    }
    return post;
  }

  @Get('user/:userId')
  async findByUserId(@Param('userId') userId: string) {
    return await this.postsService.findByUserId(parseInt(userId));
  }
}