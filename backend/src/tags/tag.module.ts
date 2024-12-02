import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from 'src/posts/post.entity';
import { TagController } from './tag.controller';
import { Tags } from './tag.entity';
import { TagService } from './tag.service';

@Module({
  imports: [TypeOrmModule.forFeature([Tags]), TypeOrmModule.forFeature([Post])],
  providers: [TagService],
  controllers: [TagController],
})
export class TagModule {}
