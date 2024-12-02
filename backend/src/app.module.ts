import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentModule } from './comments/comment.module';
import { PostModule } from './post/post.module';
import { TagModule } from './tags/tag.module';
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
    TagModule,
  ],
})
export class AppModule {}
