import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Posts } from 'src/post/post.entity';
import { CommentController } from './comment.controller';
import { Comments } from './comment.entity';
import { CommentService } from './comment.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Comments]),
    TypeOrmModule.forFeature([Posts]),
  ],
  providers: [CommentService],
  controllers: [CommentController],
})
export class CommentModule {}
