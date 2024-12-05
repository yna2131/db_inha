import { IsNumber, IsOptional, IsString } from 'class-validator';

export class PostDto {
  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsOptional()
  @IsNumber({}, { message: 'category_id must be a valid number' })
  category_id?: number;
}

export class PostListDto {
  id: number;

  title: string;

  content: string;

  created_at: Date;

  user: {
    username: string;
  };

  commentCount: number;
}
