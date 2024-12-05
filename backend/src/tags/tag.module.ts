import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostModule } from 'src/posts/posts.module';
import { Post } from 'src/posts/posts.entity';
import { TagController } from './tag.controller';
import { Tags } from './tag.entity';
import { TagService } from './tag.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Tags]),
    TypeOrmModule.forFeature([Post]),
    forwardRef(() => PostModule),
  ],
  providers: [TagService],
  exports: [TypeOrmModule, TagService], // Export TypeOrmModule so other modules can use TagsRepository
  controllers: [TagController],
})
export class TagModule { }
