import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { CategoriesModule } from './categories/categories.module';
import { PostsModule } from './posts/posts.module';
import { CommentsModule } from './comments/comments.module';

@Module({
  imports: [
    DatabaseModule,
    UsersModule,
    CategoriesModule,
    PostsModule,
    CommentsModule,
  ],
})
export class AppModule {}