import { Column } from 'typeorm';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Tags } from 'src/tags/tag.entity';

export class PostDto {
  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsOptional()
  @IsNumber({}, { message: 'category_id must be a valid number' })
  category_id?: number;

  @IsOptional()
  @IsNumber({}, { message: 'category_id must be a valid number' })
  tags?: Tags[];
}

export class PostListDto {
  id: number;

  title: string;

  content: string;
}
