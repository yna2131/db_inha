import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from 'src/posts/posts.entity';
import { CommentController } from './comment.controller';
import { Comments } from './comment.entity';
import { CommentService } from './comment.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Comments]),
    TypeOrmModule.forFeature([Post]),
  ],
  providers: [CommentService],
  controllers: [CommentController],
})
export class CommentModule { }
