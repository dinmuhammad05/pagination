import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { CommentsService, Comment } from './comments.service';

@Controller('comments')
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  @Post()
  async create(@Body() commentData: Omit<Comment, 'id' | 'created_at'>) {
    return await this.commentsService.create(commentData);
  }

  @Get()
  async findAll() {
    return await this.commentsService.findAll();
  }

  @Get('post/:postId')
  async findByPostId(@Param('postId') postId: string) {
    return await this.commentsService.findByPostId(parseInt(postId));
  }
}