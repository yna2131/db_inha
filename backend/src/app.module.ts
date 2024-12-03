import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './category/category.module';
import { CommentModule } from './comments/comments.module';
import { PostModule } from './posts/posts.module';
import { TagModule } from './tags/tag.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'blog',
      autoLoadEntities: true,
      synchronize: true,
    }),
    PostModule,
    CommentModule,
    UsersModule,
    AuthModule,
    CategoryModule,
    TagModule,
  ],
})
export class AppModule {}
