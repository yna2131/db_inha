import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { CommentModule } from './comments/comments.module';
import { PostModule } from './posts/posts.module';
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
      dropSchema: true,
    }),
    PostModule,
    CommentModule,
    UsersModule,
    AuthModule,
  ],
})
export class AppModule {}
