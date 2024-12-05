import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './post.entity';
import { PostService } from './posts.service';
import { PostController } from './posts.controller';
import { TagModule } from 'src/tags/tag.module';
import { Tags } from 'src/tags/tag.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post]), // Register Posts entity
    TypeOrmModule.forFeature([Tags]), // Register Posts entity
    forwardRef(() => TagModule), // Handle circular dependencies if needed
  ],
  controllers: [PostController],
  providers: [PostService],
  exports: [TypeOrmModule],
})
export class PostModule { }