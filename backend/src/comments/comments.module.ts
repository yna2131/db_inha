import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from 'src/posts/post.entity';
import { CommentsController } from './comments.controller';
import { Comment } from './comments.entity';
import { CommentsService } from './comments.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Comment]),
    TypeOrmModule.forFeature([Post]),
  ],
  providers: [CommentsService],
  controllers: [CommentsController],
})
export class CommentModule {}
